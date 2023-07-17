import BwipJs from "bwip-js";

const generateBarcodeImage = async (barcodeData) => {
  const pngBuffer = await BwipJs.toBuffer({
    bcid: "code128",
    text: barcodeData,
    scale: 2,
    width: 100,
    height: 100,
    includetext: true,
    textxalign: "center",
  });

  return pngBuffer.toString("base64");
};

export default generateBarcodeImage;
