import path from "path";
import { fileURLToPath } from "url";
import convertImageToBase64 from "../utils/convertImageToBase64.mjs";
import generateBarcodeImage from "../utils/generateBarcodeImage.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const parcelIcon = path.resolve(`${__dirname}/imgs/parcel.png`);
const manIcon = path.resolve(`${__dirname}/imgs/man.png`);
const weightIcon = path.resolve(`${__dirname}/imgs/weight.png`);
// const cardboardIcon = path.resolve(`${__dirname}/imgs/cardboard.png`);
// const paperBagIcon = path.resolve(`${__dirname}/imgs/paperBag.png`);
// const woodBoxIcon = path.resolve(`${__dirname}/imgs/woodbox.png`);
// const squareIcon = path.resolve(`${__dirname}/imgs/square.png`);
// const checkedParcelIcon = path.resolve(`${__dirname}/imgs/checkedParcel.png`);

const shipmantTagSmallStick = async (data) => {
  const barcodeImageBase64 = await generateBarcodeImage(
    data?.outgoingDeclaration
  );

  const parcelIconBase64 = await convertImageToBase64(parcelIcon);
  const weightIconBase64 = await convertImageToBase64(weightIcon);
  const manIconBase64 = await convertImageToBase64(manIcon);
  // const cardboardIconBase64 = await convertImageToBase64(cardboardIcon);
  // const paperBagIconBase64 = await convertImageToBase64(paperBagIcon);
  // const woodBoxIconBase64 = await convertImageToBase64(woodBoxIcon);
  // const squareIconBase64 = await convertImageToBase64(squareIcon);
  // const checkedParcelIconBase64 = await convertImageToBase64(checkedParcelIcon);

  return `<!DOCTYPE html>
    <html>
    <head>
    <meta charset="utf-8" />
    </head>
    <body>
        <div style="background-color: #fff; margin-left: auto; margin-right: auto; padding: 5px; transform: rotate(90deg); margin-top: 50px"> 
            <div style="margin-bottom: 40px">
                <div>
                    <img style="width: 700px; height: 250px" src="data:image/png;base64,${barcodeImageBase64}" />
                </div>
                <div style="margin-top: 50px; display: flex; align-items: center;">
                    <img src="${parcelIconBase64}" alt="parcel-icon" style="width: 80px; height: 70px;" />
                    <div style="font-size: 55px; padding-left: 20px">${data.id}</div>
                </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; width: 700px">
                <div>
                    <div style="display: flex; align-items: center; padding-bottom: 25px">
                        <img src="${manIconBase64}" alt="man-icon" style="width: 80px; height: 70px;" />
                        <div style="font-size: 55px; padding-left: 20px">${data.clientId}</div>
                    </div>
                    <div style="display: flex; align-items: center">
                        <img src="${weightIconBase64}" alt="weight-icon" style="width: 80px; height: 70px;" />
                        <div style="font-size: 55px; padding-left: 20px">${data.weight}</div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>`;
};

export default shipmantTagSmallStick;
