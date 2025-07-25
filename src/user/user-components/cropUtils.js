// src/utils/cropUtils.js

export default function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";

    image.onload = () => {
      const radians = (rotation * Math.PI) / 180;

      const offCanvas = document.createElement("canvas");
      const offCtx = offCanvas.getContext("2d");

      const maxSize = Math.max(image.width, image.height);
      offCanvas.width = maxSize * 2;
      offCanvas.height = maxSize * 2;

      offCtx.translate(offCanvas.width / 2, offCanvas.height / 2);
      offCtx.rotate(radians);
      offCtx.drawImage(image, -image.width / 2, -image.height / 2);

      const cropX = Math.max(0, Math.floor(pixelCrop.x));
      const cropY = Math.max(0, Math.floor(pixelCrop.y));
      const cropWidth = Math.max(1, Math.floor(pixelCrop.width));
      const cropHeight = Math.max(1, Math.floor(pixelCrop.height));

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = cropWidth;
      canvas.height = cropHeight;

      ctx.drawImage(
        offCanvas,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Canvas is empty"));
          try {
            const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });
            resolve(file);
          } catch (err) {
            // fallback for older browsers not supporting File constructor
            const fallbackFile = new Blob([blob], { type: "image/jpeg" });
            resolve(fallbackFile);
          }
        },
        "image/jpeg",
        1
      );
    };

    image.onerror = () => reject(new Error("Failed to load image"));
    image.src = imageSrc;
  });
}

