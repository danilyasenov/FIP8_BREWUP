import React, { useState } from "react";
import PriceCalculator from "../components/PriceCalculator";
import SVGUploader from "../components/SVGUploader";
//wasd

function Calculator() {
  // Состояния: файл, длина вектора, предпросмотр и оригинальный размер
  const [file, setFile] = useState(null);
  const [vectorLength, setVectorLength] = useState(0);
  const [preview, setPreview] = useState(null);
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });

  return (
    <div className="min-h-screen bg-blue-900 p-4 md:p-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Блок: Калькулятор цен */}
        <div className="flex justify-center">
          <div className="bg-blue-900 w-full md:w-3/4 p-6 md:p-10 shadow-lg rounded-lg">
            <PriceCalculator
              file={file}
              vectorLength={vectorLength}
              originalSize={originalSize}
              onResetFile={() => {
                setFile(null);
                setPreview(null);
              }}
            />
          </div>
        </div>

        {/* Блок: Загрузка SVG-файла */}
        <div className="bg-white w-full md:w-3/4 p-6 md:p-10 shadow-lg rounded-lg flex flex-col items-center">
          <h2 className="text-lg font-bold mb-4">📂 Загрузите SVG-файл</h2>

          <SVGUploader
            setFile={setFile}
            setVectorLength={setVectorLength}
            setPreview={setPreview}
            setOriginalSize={setOriginalSize}
          />

          {/* Блок предпросмотра файла */}
          {preview && (
            <div className="mt-6 flex flex-col items-center w-full">
              <h2 className="text-lg font-semibold mb-2">Предпросмотр SVG:</h2>
              <div className="border p-4 bg-gray-100 rounded-lg relative">
                <img src={preview} alt="SVG Preview" className="w-40 h-40 object-contain" />

                {/* Кнопка очистки файла */}
                <button
                  className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-800"
                  onClick={() => {
                    setPreview(null);
                    setFile(null);
                  }}
                >
                  ❌
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Calculator;
