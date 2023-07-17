import cors from "cors";
import express from "express";
import fs from "fs";
import os from "os";
import path from "path";
import { PDFDocument } from "pdf-lib";
import ptp from "pdf-to-printer";
import puppeteer from "puppeteer";
import { ReadlineParser, SerialPort } from "serialport";
import { fileURLToPath } from "url";
import { promisify } from "util";
import selectCorrespondenceHtml from "./utils/selectCorrespondenceHtml.mjs";

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
const writeFileAsync = promisify(fs.writeFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const platform = os.platform();

const serialPortName = "Prolific USB-to-Serial Comm Port";

let serialPortPath = "";

SerialPort.list()
  .then((ports) => {
    ports.forEach((port) => {
      if (port.friendlyName?.includes(serialPortName)) {
        serialPortPath = port.path;
        console.log(serialPortPath);
      }
    });
  })
  .catch((error) => {
    console.error("Error:", error);
  });

app.get("/getweightfromscale", (req, res) => {
  const sendData = (code, weight) => res.status(code).send(weight);

  const port = new SerialPort({
    path: serialPortPath,
    baudRate: 9600, // Set the correct serial baud rate
    parser: new ReadlineParser("\n"),
  });

  port.on("open", () => {
    port.write(Buffer.from("status1", "ascii"), (err) => {
      if (err) {
        console.log("err: ", err);
        sendData(500, err.message);
      }
    });
  });

  let buffer = "";
  let isDataSent = false;
  port.on("data", (chunk) => {
    buffer += chunk;
    const answers = buffer.split(/\r?\n/);
    buffer = answers.pop();

    if (answers.length > 0) {
      if (!isDataSent && answers[0]) {
        const weightGrams = Number(
          answers[0].trim().slice(0, answers[0].trim().indexOf(" "))
        );
        sendData(200, weightGrams.toString());
        isDataSent = true;
      }
    }

    if (isDataSent) {
      port.close((error) => {
        if (error) {
          console.error("Error closing COM port:", error);
        } else {
          console.log("COM port closed successfully.");
        }
      });
    }
  });

  port.on("error", (err) => {
    sendData(500, err.message);
  });
});

app.post("", express.raw({ type: "application/json" }), async (req, res) => {
  const html = await selectCorrespondenceHtml(req.body);

  const options = {
    format: "A5",
    orientation: "portrait",
    border: "1mm",
  };

  const document = {
    html: html,
    data: {},
    path: `${__dirname}${platform === "win32" ? "\\" : "/"}output.pdf`,
    type: "",
  };

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      executablePath:
        "./node_modules/puppeteer/.local-chromium/win64-656675/chrome-win/chrome.exe",
    });
    const page = await browser.newPage();

    await page.setContent(document.html);

    const pdfData = await page.pdf({
      format: options.format,
      landscape: options.orientation === "landscape",
      printBackground: true,
    });

    await browser.close();

    const pdfDoc = await PDFDocument.create();

    const generatedPdf = await PDFDocument.load(pdfData);

    const [generatedPage] = await pdfDoc.copyPages(generatedPdf, [0]);
    pdfDoc.addPage(generatedPage);

    const pdfBytes = await pdfDoc.save();
    await writeFileAsync(document.path, pdfBytes);

    await ptp.print(document.path, {});

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred during PDF generation and printing.");
  }
});

app.listen(port, () => {
  console.log(`PDF Printing Service listening on port ${port}`);
});
