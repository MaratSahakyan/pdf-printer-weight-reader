import base64Img from "base64-img";

const convertImageToBase64 = (imagePath) => {
  return new Promise((resolve, reject) => {
    base64Img.base64(imagePath, (error, base64String) => {
      if (error) {
        console.error("Error converting image to base64:", error);
        reject(error);
      } else {
        resolve(base64String);
      }
    });
  });
};

export default convertImageToBase64;
