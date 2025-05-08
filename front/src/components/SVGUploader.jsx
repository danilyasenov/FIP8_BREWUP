import React from "react";
import { useTranslation } from "react-i18next";

function SVGUploader({ setFile, setVectorLength, setPreview, setOriginalSize }) {
  const { t } = useTranslation();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const svgText = e.target.result;
      const svgDoc = new DOMParser().parseFromString(svgText, "image/svg+xml");
      const svgElement = svgDoc.querySelector("svg");
      if (!svgElement) {
        alert(t("upload.invalid_svg"));
        return;
      }

      const paths = svgElement.querySelectorAll("path");
      let totalLength = 0;
      paths.forEach((path) => {
        totalLength += path.getTotalLength();
      });
      setVectorLength(parseFloat(totalLength.toFixed(2)));

      let rawWidth = svgElement.getAttribute("width") || svgElement.viewBox.baseVal.width;
      let rawHeight = svgElement.getAttribute("height") || svgElement.viewBox.baseVal.height;

      rawWidth = parseFloat(String(rawWidth).replace(/[^\d.]/g, "")) || 100;
      rawHeight = parseFloat(String(rawHeight).replace(/[^\d.]/g, "")) || 100;

      setOriginalSize({ width: rawWidth, height: rawHeight });
    };
    reader.readAsText(file);

    const previewReader = new FileReader();
    previewReader.onload = (e) => setPreview(e.target.result);
    previewReader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center">
      <label className="w-40 h-28 flex items-center justify-center border-2 border-blue-500 rounded-lg cursor-pointer text-black font-semibold text-lg bg-white hover:bg-gray-200 transition">
        {t("upload.label")}
        <input type="file" accept=".svg" onChange={handleFileUpload} className="hidden" />
      </label>
    </div>
  );
}

export default SVGUploader;
