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
    const id = data?.lastMileDeliveryMethodId;
    if (id === 1) {
      const base64 = await convertImageToBase64(curierImg);
      return `<img style="width: 45px;" src="${base64}" alt="curier" />`;
    } else if (id === 2) {
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
    const id = data?.lastMileOperatorId;
    if (+id === 2) {
      const base64 = await convertImageToBase64(sber);
      return `<img style="width: 80px;" src="${base64}" alt="SBER" />`;
    } else if (id === 3) {
      const base64 = await convertImageToBase64(cdek);
      return `<img style="width: 80px;" src="${base64}" alt="CDEK" />`;
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
        <div style="background-color: white; min-width: 450px; min-height: 295px; width: 100%; height: 100%; padding: 20px; transform: rotate(90deg); margin-top: 80px;"
            <div style="width: 100%; height: 100%; margin: 0 auto;">
                <div style="width: 100%; display: flex; flex-direction: column; align-items: center; padding-top: 100px;">
                    <div style="font-size: 65px; font-family: 'Lato sans-serif'; text-align: center;">${
                      data?.iewnumber
                    }</div>
                <div>
                    <img src="data:image/png;base64,${barcodeImageBase64}" alt="Barcode" style="width: 550px; height: 150px;">
                </div>
            </div>
            <div style="padding: 30px;">
                <div style="font-family: 'Lato sans-serif'; text-align: justify; font-weight: 700; font-size: 30px;">
                    ${data?.receiver_FULL_NAME} / ${data?.receiver_CITY}
                </div>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 30px;">
                <div style="font-family: 'Lato sans-serif'; font-weight: 700; font-size: 40px;">
                    <div>
                        ${
                          Math.round(data?.deliveryCost * data?.rate * 100) /
                            100 ||
                          Math.round(data?.parcel_COST * data?.rate * 100) / 100
                        } ¥
                    </div>
                    <div>${data?.weight} kg</div>
                </div>
                <div style="width: 230px; height: 100px; border: 2px solid #000; display: flex;">
                    <div style="width: 140px; height: 100%; display: flex; align-items: center; justify-content: space-between; padding: 5px;">
                        <div>${deliveryMethodIcon}</div>
                        <div>${methodIcon}</div>
                    </div>
                    <div style="border: 1px solid #000; height: 100%;"></div>
                        <div style="font-family: 'Lato sans-serif'; font-size: 45px; font-weight: 700; display: flex; align-items: center; justify-content: center; width: 90px; height: 100%;">
                            ${data?.lastMileDeliveryMethodId}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>`;
};

export default shipmentTagAfterWeight;
