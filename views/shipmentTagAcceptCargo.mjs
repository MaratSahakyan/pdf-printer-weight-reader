import path from "path";
import { fileURLToPath } from "url";
import convertImageToBase64 from "../utils/convertImageToBase64.mjs";
import generateBarcodeImage from "../utils/generateBarcodeImage.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const unpackageIcon = path.resolve(`${__dirname}/imgs/unpackageIcon.png`);

const shipmentTagAcceptCargo = async (data) => {
  const barcodeImageBase64 = await generateBarcodeImage(data?.number);
  const unpackageIconBase64 = await convertImageToBase64(unpackageIcon);

  return `<!DOCTYPE html>
    <html>
    <head>
    <meta charset="utf-8" />
    </head>
    <body>
        <div style="width: 500px; height: 400px; background-color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: space-between; margin-top: 150px; transform: rotate(90deg);">
        <div style="width: 500px; height: 150px;">
          <img alt="barcode" src="data:image/png;base64,${barcodeImageBase64}" style="width: 500px; height: 150px;" />
          <div style="font-family: Lato, sans-serif; font-weight: 400; font-size: 70px; letter-spacing: 1px; text-align: center;">${
            data.number
          }</div>
        </div>
        <div style="width: 500px; height: 150px; border: 2px solid #000; display: flex;">
          <div style="height: 100%; width: 44%; font-family: Lato, sans-serif; font-weight: 400; padding: 3px; font-size: 25px;">${
            data.description || data.name
          }</div>
          <div style="border: 1px solid #000; height: 100%;"></div>
          <div style="height: 100%; width: 56%;">
            <div style="font-family: Lato, sans-serif; font-weight: 700; font-size: 40px; text-align: center; height: 50%; border-bottom: 2px solid #000; width: 100%; display: flex; align-items: center; justify-content: center;">${
              data?.cellNum
            }</div>
            <div style="height: 50%; height: 100%; display: flex;">
              <div style="font-family: Lato, sans-serif; font-weight: 300; font-size: 30px; width: 65%; height: 50%; border-right: 2px solid #000;">
                <div style="text-align: center;">DP-${data?.clientId}</div>
                <div style="text-align: center;">${data.weight} кг</div>
              </div>
              <div style="width: 35%; height: 50%; display: flex; justify-content: center;">
                ${
                  data.hasUnpackageService > -1
                    ? `<img src="${unpackageIconBase64}" alt="unpackage" style="width: 80px; height: 70px;" />`
                    : ""
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
</html>`;
};

export default shipmentTagAcceptCargo;
