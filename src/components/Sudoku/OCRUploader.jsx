import React, { useState, useEffect } from "react";
import Tesseract from "tesseract.js";
import cv from "opencv.js";

const OCRUploader = ({ onProcessComplete }) => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cvLoaded, setCvLoaded] = useState(false);

  // Wait for OpenCV to load
  useEffect(() => {
    const checkOpenCV = () => {
      if (window.cv && window.cv.imread) {
        setCvLoaded(true);
        console.log("OpenCV loaded successfully");
      } else {
        setTimeout(checkOpenCV, 100);
      }
    };
    checkOpenCV();
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const processImage = () => {
    if (!image || !cvLoaded) {
      console.error("OpenCV not loaded or image not available");
      return;
    }
    setIsProcessing(true);

    // Get the HTML element by ID
    const imgElement = document.getElementById("uploadedImage");
    if (!imgElement) {
      console.error("Uploaded image element not found");
      setIsProcessing(false);
      return;
    }

    // Use the HTML element for cv.imread
    let src = cv.imread(imgElement);

    // Convert to grayscale
    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);

    // Deskew the image
    const deskewed = deskewImage(src);
    src.delete(); // Free the original source image to save memory
    src = deskewed;

    // Apply Gaussian blur to reduce noise
    cv.GaussianBlur(src, src, new cv.Size(5, 5), 0);

    // Increase contrast
    cv.convertScaleAbs(src, src, 1.5, 0);

    // Apply adaptive thresholding
    cv.adaptiveThreshold(
      src,
      src,
      255,
      cv.ADAPTIVE_THRESH_GAUSSIAN_C,
      cv.THRESH_BINARY,
      11,
      2
    );

    let dsize = new cv.Size(src.cols * 2, src.rows * 2);
    cv.resize(src, src, dsize, 0, 0, cv.INTER_LINEAR);

    cv.imshow("canvasOutput", src); // Display the preprocessed image (optional)
    const processedImage = document.getElementById("canvasOutput");

    Tesseract.recognize(processedImage, "eng", {
      tessedit_char_whitelist: "0123456789",
      tessedit_pageseg_mode: 6,
      logger: (m) => console.log(m),
    })
      .then(({ data: { text } }) => {
        setText(text);
        setIsProcessing(false);
        onProcessComplete(text);
      })
      .catch((error) => {
        console.error("OCR processing error: ", error);
        setIsProcessing(false);
      })
      .finally(() => {
        src.delete(); // Clean up OpenCV resources
      });
  };

  const deskewImage = (src) => {
    let dst = new cv.Mat();
    let lines = new cv.Mat();
    cv.Canny(src, dst, 50, 150, 3, false);
    cv.HoughLinesP(dst, lines, 1, Math.PI / 180, 100, 50, 10);

    let angle = 0;
    for (let i = 0; i < lines.rows; ++i) {
      let [x1, y1, x2, y2] = lines.data32S.subarray(i * 4, i * 4 + 4);
      angle += Math.atan2(y2 - y1, x2 - x1);
    }
    angle = (angle / lines.rows) * (180 / Math.PI);

    let center = new cv.Point(src.cols / 2, src.rows / 2);
    let rotationMatrix = cv.getRotationMatrix2D(center, angle, 1);
    cv.warpAffine(
      src,
      dst,
      rotationMatrix,
      src.size(),
      cv.INTER_LINEAR,
      cv.BORDER_CONSTANT,
      new cv.Scalar()
    );

    lines.delete();
    return dst;
  };
  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {image && (
        <img
          id="uploadedImage"
          src={image}
          alt="Uploaded"
          style={{ maxWidth: "400px", margin: "10px 0" }}
        />
      )}
      <button
        onClick={processImage}
        disabled={!image || !cvLoaded || isProcessing}
      >
        {isProcessing ? "Processing..." : "Extract Sudoku"}
      </button>
      <canvas id="canvasOutput" style={{ display: "none" }}></canvas>
    </div>
  );
};

export default OCRUploader;
