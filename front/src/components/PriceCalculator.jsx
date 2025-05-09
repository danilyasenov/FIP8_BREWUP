import React, { useState, useEffect } from "react";
import {
  MATERIALS,
  PX_TO_CM,
  MAX_SIZE,
  MIN_SIZE,
} from "../utils/constants";
import { calculateLaserJob } from "../utils/priceCalculator";
import InstructionModal from "./modals/InstructionModal";
import ChangeSizeModal from "./modals/ChangeSizeModal";
import SuccessModal from "./modals/SuccessModal";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { API_URL } from "../config";

function PriceCalculator({ vectorLength, originalSize, file, onResetFile }) {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  // Выбор параметров: режим, материал, толщина
  const [mode, setMode] = useState("cutting");
  const [material, setMaterial] = useState("Фанера");
  const [thickness, setThickness] = useState("3mm");

  // Управление модальными окнами
  const [showInstructions, setShowInstructions] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Начальные размеры (в см)
  const initialWidthCm = originalSize.width / PX_TO_CM || 10;
  const initialHeightCm = originalSize.height / PX_TO_CM || 10;

  const [widthCm, setWidthCm] = useState(initialWidthCm);
  const [heightCm, setHeightCm] = useState(initialHeightCm);

  // Обновляем размеры при смене файла
  useEffect(() => {
    setWidthCm(initialWidthCm);
    setHeightCm(initialHeightCm);
  }, [originalSize]);

  // Получение цены и времени на основе текущих параметров
  const materialCost = MATERIALS[material][thickness];
  const { operationTime, totalCost, work } = calculateLaserJob({
    mode,
    thickness,
    widthCm,
    heightCm,
    initialWidthCm,
    initialHeightCm,
    vectorLength,
    materialCost,
  });

  // Сброс параметров калькулятора
  const resetCalculator = () => {
    setMode("cutting");
    setMaterial("Фанера");
    setThickness("3mm");
    setWidthCm(initialWidthCm);
    setHeightCm(initialHeightCm);
    if (onResetFile) onResetFile();
  };

  // Отправка заказа на сервер
  const handleSubmit = async () => {
    if (!file) {
      toast.error(t("calculator.error.no_file"));
      return;
    }

    if (!isAuthenticated) {
      toast.error(t("calculator.error.not_authenticated"));
      return;
    }

    const token = localStorage.getItem("access");
    if (!token) {
      toast.error(t("calculator.error.no_token"));
      return;
    }

    // Сбор данных для заказа
    const formData = new FormData();
    formData.append("file", file);
    formData.append("mode", mode);
    formData.append("material", material);
    formData.append("thickness", thickness);
    formData.append("width", widthCm.toFixed(2));
    formData.append("height", heightCm.toFixed(2));
    formData.append("price", totalCost.toFixed(2));
    formData.append("status", "waiting");
    formData.append("work", work.toFixed(2));
    formData.append("laser_work", operationTime.toFixed(2));
    formData.append("comment", "");

    try {
      const response = await fetch(`${API_URL}/orders/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        toast.success(t("calculator.success"));
        setShowSuccessModal(true);
        resetCalculator();
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 3000);
      } else if (response.status === 401) {
        toast.error(t("calculator.error.unauthorized"));
      } else {
        toast.error(t("calculator.error.generic"));
      }
    } catch (err) {
      console.error("Ошибка отправки:", err);
      toast.error(t("calculator.error.network"));
    }
  };

  // ML-проверка: вырезка или гравировка
  const handleMLCheck = async () => {
    if (!file) {
      toast.error(t("calculator.error.no_file"));
      return;
    }

    if (!isAuthenticated) {
      toast.error(t("calculator.error.not_authenticated"));
      return;
    }

    const token = localStorage.getItem("access");
    if (!token) {
      toast.error(t("calculator.error.no_token"));
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/orders/predict-svg/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        const text = await response.text();
        console.error("Raw response (not JSON):", text);
        toast.error(t("calculator.error.generic"));
        return;
      }

      if (!response.ok) {
        toast.error(t("calculator.error.generic"));
        return;
      }

      // Вывод результата предсказания
      if (data.result === "cut") {
        toast.success(t("calculator.result.cut"));
      } else if (data.result === "engrave") {
        toast(t("calculator.result.engrave"));
      } else {
        toast.error(t("calculator.error.generic"));
      }
    } catch (error) {
      console.error("ML check error:", error);
      toast.error(t("calculator.error.network"));
    }
  };

  return (
    <div className="w-3/ p-8 bg-white rounded-lg shadow-lg">
      {/* Кнопка с инструкциями */}
      <button
        onClick={() => setShowInstructions(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mb-4"
      >
        {t("calculator.instructions")}
      </button>

      {/* Заголовок и предупреждение */}
      <h2 className="text-3xl font-bold mb-4 text-gray-900">{t("calculator.title")}</h2>
      <p className="text-red-500 font-semibold text-lg mb-6">
        🔔 {t("calculator.warning", { min: MIN_SIZE, max: MAX_SIZE })}
      </p>

      {/* Выбор режима */}
      <div className="mb-6">
        <p className="font-semibold text-gray-800 mb-3 text-lg">{t("calculator.mode")}</p>
        <div className="flex space-x-4">
          {["cutting", "engraving"].map((item) => (
            <button
              key={item}
              onClick={() => setMode(item)}
              className={`px-5 py-3 rounded-md font-medium text-lg transition ${
                mode === item ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {t(`calculator.modes.${item}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Выбор материала */}
      <div className="mb-6">
        <p className="font-semibold text-gray-800 mb-3 text-lg">{t("calculator.material")}</p>
        <div className="flex space-x-4">
          {Object.keys(MATERIALS).map((mat) => (
            <button
              key={mat}
              onClick={() => setMaterial(mat)}
              className={`px-5 py-3 rounded-md font-medium text-lg transition ${
                material === mat ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {t(`materials.${mat}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Выбор толщины */}
      <div className="mb-6">
        <p className="font-semibold text-gray-800 mb-3 text-lg">{t("calculator.thickness")}</p>
        <div className="flex space-x-4">
          {Object.keys(MATERIALS[material]).map((thick) => (
            <button
              key={thick}
              onClick={() => setThickness(thick)}
              className={`px-5 py-3 rounded-md font-medium text-lg transition ${
                thickness === thick ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {thick}
            </button>
          ))}
        </div>
      </div>

      {/* Текущие размеры */}
      <div className="text-lg mb-4">
        <p>📏 {t("calculator.width")}: <strong>{widthCm.toFixed(2)} см</strong></p>
        <p>📐 {t("calculator.height")}: <strong>{heightCm.toFixed(2)} см</strong></p>
      </div>

      {/* Кнопка изменения размеров */}
      <button
        onClick={() => setShowSizeModal(true)}
        className="mb-6 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
      >
        {t("calculator.change_size")}
      </button>

      {/* Модалка изменения размеров */}
      {showSizeModal && (
        <ChangeSizeModal
          initialWidth={widthCm}
          initialHeight={heightCm}
          aspectRatio={initialWidthCm / initialHeightCm}
          onApply={({ width, height }) => {
            setWidthCm(width);
            setHeightCm(height);
          }}
          onClose={() => setShowSizeModal(false)}
        />
      )}

      {/* Общая цена */}
      <h3 className="text-2xl font-bold mt-6 text-gray-900">
        {t("calculator.total_price")}: {totalCost.toFixed(2)} сом
      </h3>

      {/* Кнопки отправки и ML-проверки */}
      <div className="flex flex-col space-y-3 mt-4 mb-4">
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
        >
          {t("calculator.submit")}
        </button>

        <button
          onClick={handleMLCheck}
          className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition"
        >
          {t("calculator.check_cut")}
        </button>
      </div>

      {/* Модальные окна */}
      <InstructionModal
        visible={showInstructions}
        onClose={() => setShowInstructions(false)}
      />
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
}

export default PriceCalculator;
