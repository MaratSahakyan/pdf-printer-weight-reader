import generateBarcodeImage from "../utils/generateBarcodeImage.mjs";

const shipmantTagSmallStick = async (data) => {
  const barcodeImageBase64 = await generateBarcodeImage(
    data?.outgoingDeclaration
  );

  return `<!DOCTYPE html>
    <html>
    <head>
    <meta charset="utf-8" />
    </head>
    <body>
        <div style="background-color: #fff; margin-left: auto; margin-right: auto; padding: 5px; transform: rotate(90deg);"> 
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding-top: 50px; margin-left: 300px;">
                ${
                  data &&
                  `
                    <div>
                        <div>
                            <div>
                                <img style="width: 600px; height: 220px" src="data:image/png;base64,${barcodeImageBase64}" />
                            </div>
                            <div style="font-size: 68px; text-align: center;">${data?.outgoingDeclaration}</div>
                        </div>
                        <div style="margin-top: 20px">
                            <div style="font-size: 30px; text-align: center;">
                                Parcel ID: <b style="font-size: 30px;">${data.id}</b>
                            </div>
                            <div style="font-size: 30px; text-align: center; margin-top: 20px;">
                                Client ID: <b style="font-size: 30px;">${data.clientId}</b>
                            </div>
                        </div>
                    </div>
                `
                }
            </div>
        </div>
    </body>
</html>`;
};

export default shipmantTagSmallStick;
