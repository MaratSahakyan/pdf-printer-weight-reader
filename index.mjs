import axios from "axios";
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
const printerName = "Gprinter GP-1324D";

let serialPortPath = ""; // Set the correct serial port path

const getCorrectPrinter = async () => {
  const printerList = await ptp.getPrinters();
  const hasPrinterNameinList = printerList.includes(printerName);

  return hasPrinterNameinList ? printerName : "";
};

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

  if (!serialPortPath) {
    console.log(`You don't have available COM port !!!`);
    return;
  }

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

///////////////////////////////////////////////////////////////

app.get("/print/parcel/:trackCode", async (req, res) => {
  const { trackCode } = req.params;
  const trimedTrackCode = trackCode?.trim();

  if (!trimedTrackCode) {
    res.status(400).send("Bad Request.");
    return;
  }
  const url = "https://api.dobropost.com/api/sending-registry/data/trackCode";

  try {
    const response = await axios.get(url, {
      params: {
        trackCode: trimedTrackCode,
      },
    });

    const data = response.data;

    if (!data) {
      res.status(404).send("Parcel Not Found!");
    }

    const deliveryTransportId =
      data?.data?.delivery_METHOD?.trackCodePrefix?.replace("DBRPST", "");

    const requestData = {
      printCheckName: "SHIPMENT_TAG_AFTER_WEIGHT",
      iewnumber: data?.data?.iewnumber || "",
      receiverFullName: data?.data?.receiver_FULL_NAME || "",
      receiverCity: data?.data?.receiver_CITY || "",
      deliveryCost: data?.data?.deliveryCost || "",
      parcelCost: data?.data?.parcel_COST || "",
      weight: data?.data?.weight || data?.data?.actual_WEIGHT || "",
      lastMileOperatorId: data?.lastMileOperator?.id || "",
      lastMileDeliveryMethodId: data?.lastMileDeliveryMethod?.id || "",
      deliveryTransportId: deliveryTransportId || "",
    };

    axios.post("http://localhost:3000/print", requestData);
    res.status(200).send("ok");
  } catch (error) {
    console.error("Error making the request:", error);
    res
      .status(500)
      .send("An error occurred during PDF generation and printing.");
  }
});

///////////////////////////////////////////////////////////////

const browser = await puppeteer.launch({
  headless: "new",
});

const page = await browser.newPage();

app.post(
  "/print",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const html = await selectCorrespondenceHtml(req.body);

    const options = {
      format: "A5",
      orientation: "portrait",
      border: "1mm",
    };

    const document = {
      html: html,
      path: `${__dirname}${platform === "win32" ? "\\" : "/"}output.pdf`,
    };

    try {
      await page.setContent(document.html, { waitUntil: "domcontentloaded" });

      const pdfData = await page.pdf({
        format: options.format,
        landscape: options.orientation === "landscape",
        printBackground: true,
      });

      const pdfDoc = await PDFDocument.create();

      const generatedPdf = await PDFDocument.load(pdfData);

      const [generatedPage] = await pdfDoc.copyPages(generatedPdf, [0]);
      pdfDoc.addPage(generatedPage);

      const pdfBytes = await pdfDoc.save();
      await writeFileAsync(document.path, pdfBytes);

      const correctPrinterName = await getCorrectPrinter();

      if (!correctPrinterName) {
        console.log(`Printer "${printerName}" not found.`);
        return;
      }

      await ptp.print(document.path, { printer: correctPrinterName });

      res.status(204).send();
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send("An error occurred during PDF generation and printing.");
    }
  }
);

app.listen(port, () => {
  console.log(`PDF Printing Service listening on port ${port}`);
});
