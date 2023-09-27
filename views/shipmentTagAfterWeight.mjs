import path from "path";
import { fileURLToPath } from "url";
import convertImageToBase64 from "../utils/convertImageToBase64.mjs";
import generateBarcodeImage from "../utils/generateBarcodeImage.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const curierImg = path.resolve(`${__dirname}/imgs/curierImg.png`);
const freeLocationIcon = path.resolve(`${__dirname}/imgs/freeLocationIcon.png`);
const sber = path.resolve(`${__dirname}/imgs/sber.png`);
const cdek = path.resolve(`${__dirname}/imgs/cdek.png`);

const shipmentTagAfterWeight = async (data) => {
  const getMathodIconById = async () => {
    const id = Number(data?.lastMileDeliveryMethodId);
    if (id === 1) {
      const base64 = await convertImageToBase64(curierImg);
      return `<img style="width: 45px;" src="${base64}" alt="curier" />`;
    }
    if (id === 2) {
      const base64 = await convertImageToBase64(freeLocationIcon);
      return `<img
            style="width: 45px;"
            src="${base64}"
            alt="Free Location"
            />`;
    }
    return "";
  };

  const getIcon = async () => {
    const id = Number(data?.lastMileOperatorId);
    if (id === 1) {
      return `<div style="font-size: 40px; text-align: center;"><b>Новая Почта</b></div>`;
    }
    if (id === 2) {
      const base64 = await convertImageToBase64(sber);
      return `<img style="width: 80px;" src="${base64}" alt="SBER" />`;
    }
    if (id === 3) {
      const base64 = await convertImageToBase64(cdek);
      return `<img style="width: 110px;" src="${base64}" alt="CDEK" />`;
    }
    if (id === 4) {
      return `<div style="font-size: 40px; text-align: center;"><b>ПВЗ DobroPost</b></div>`;
    }
    if (id === 5) {
      return `<div style="font-size: 40px; text-align: center;"><b>Боксберри</b></div>`;
    }

    return "";
  };

  const barcodeImageBase64 = await generateBarcodeImage(data?.iewnumber);
  const methodIcon = await getMathodIconById();
  const deliveryMethodIcon = await getIcon();

  return `<!DOCTYPE html>
    <html>
    <head>
    <meta charset="utf-8" />
    </head>
    <body>
      <div style="background-color: white; min-width: 450px; min-height: 295px; width: 100%; height: 100%; padding: 20px; margin-top: 130px; margin-left: 50px; padding-left: 40px; transform: rotate(90deg) scale(1.1);" >
            <div style="width: 100%; height: 100%; margin: 0 auto; padding-left: 40px;">
                <div style="width: 100%; display: flex; flex-direction: column; align-items: center; padding-top: 100px;">
                    <div style="font-size: 88px; font-family: 'Lato sans-serif'; text-align: center;">${data?.iewnumber}</div>
                <div>
                    <img src="data:image/png;base64,${barcodeImageBase64}" alt="Barcode" style="width: 770px; height: 180px;">
                </div>
            </div>
            <div style="padding-top: 80px;">
                <div style="font-family: 'Lato sans-serif'; text-align: justify; font-weight: 700; font-size: 40px;">
                    ${data?.receiverFullName} / ${data?.receiverCity}
                </div>
            </div>
            <div style="display: flex; justify-content: space-between; width: 795px; padding-top: 60px;">
                <div style="width: 795px; height: 150px; display: flex; align-items: center; border: 2px solid #000; display: flex;">
                <div style="font-family: 'Lato sans-serif'; font-size: 70px; font-weight: 700; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 200px; height: 100%; text-align: center;">
                        <div>${data?.weight}</div>
                        <div>kg</div>
                    </div>

                    <div style="border: 1px solid #000; height: 100%;"></div>

                    <div style="height: 100%; display: flex; align-items: center; padding: 5px; min-width: 200px;">
                        <div style="margin: auto;">${deliveryMethodIcon}</div>
                    </div>

                    <div style="border: 1px solid #000; height: 100%;"></div>

                    <div style="height: 100%; display: flex; align-items: center; padding: 5px; min-width: 200px;">
                        <div style="margin: auto;">${methodIcon}</div>
                    </div>

                    <div style="border: 1px solid #000; height: 100%;"></div>

                    <div style="font-family: 'Lato sans-serif'; font-size: 90px; font-weight: 700; display: flex; align-items: center; justify-content: center; min-width: 200px; height: 100%;">
                        <div style="margin: auto;">${data?.deliveryTransportId}</div>
                    </div>
                  </div>
                </div>
            </div>
        </div>
    </body>
</html>`;
};

export default shipmentTagAfterWeight;
