import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export default function ChangeSizeModal({
  initialWidth,
  initialHeight,
  aspectRatio,
  onClose,
  onApply,
}) {
  const { t } = useTranslation();
  const [mode, setMode] = useState("width"); // Активный режим: ввод ширины или высоты
  const [inputValue, setInputValue] = useState("");
  const modalRef = useRef(null);

  // Вычисление допустимых границ значений по ширине и высоте
  const getLimits = () => {
    const widthIsLarger = aspectRatio >= 1;

    if (mode === "width") {
      return widthIsLarger
        ? [1 * aspectRatio, 150]
        : [1, 150 * aspectRatio];
    } else {
      return widthIsLarger
        ? [1, 150 / aspectRatio]
        : [1 / aspectRatio, 150];
    }
  };

  const [min, max] = getLimits();

  // При переключении между режимами — обновляем поле ввода
  useEffect(() => {
    setInputValue((mode === "width" ? initialWidth : initialHeight).toFixed(2));
  }, [mode]);

  // Закрытие модалки при клике вне неё
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        handleApply();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [inputValue, mode]);

  // Применить изменения размеров и закрыть модалку
  const handleApply = () => {
    let value = parseFloat(inputValue.replace(",", "."));
    if (isNaN(value)) value = min;
    value = Math.min(Math.max(value, min), max);

    let newWidth, newHeight;
    if (mode === "width") {
      newWidth = value;
      newHeight = value / aspectRatio;
    } else {
      newHeight = value;
      newWidth = value * aspectRatio;
    }

    onApply({
      width: parseFloat(newWidth.toFixed(2)),
      height: parseFloat(newHeight.toFixed(2)),
    });
    onClose();
  };

  // Обработка ввода: только числа, с двумя знаками после запятой
  const handleInputChange = (e) => {
    let val = e.target.value;
    if (!/^[\d.,]*$/.test(val)) return;
    val = val.replace(",", ".").replace(/^0+(?=\d)/, "");
    if (val.includes(".")) {
      const [intPart, decPart] = val.split(".");
      val = intPart + "." + decPart.slice(0, 2);
    }
    setInputValue(val);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-xl shadow-lg w-96 space-y-4"
      >
        {/* Заголовок */}
        <h3 className="text-xl font-bold text-gray-900">
          {t("change_size_modal.title")}
        </h3>

        {/* Переключение между вводом ширины и высоты */}
        <div className="flex space-x-4">
          <button
            className={`flex-1 py-2 rounded-lg text-lg font-medium ${
              mode === "width"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setMode("width")}
          >
            {t("change_size_modal.width")}
          </button>
          <button
            className={`flex-1 py-2 rounded-lg text-lg font-medium ${
              mode === "height"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setMode("height")}
          >
            {t("change_size_modal.height")}
          </button>
        </div>

        {/* Поле ввода значения */}
        <input
          type="text"
          inputMode="decimal"
          value={inputValue}
          onChange={handleInputChange}
          className="border rounded-md p-3 w-full text-lg"
          placeholder={t("change_size_modal.placeholder")}
        />

        {/* Информация о допустимом диапазоне */}
        <p className="text-gray-600 text-sm">
          {t("change_size_modal.range", {
            min: min.toFixed(2),
            max: max.toFixed(2),
          })}
        </p>

        {/* Кнопка сохранить */}
        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={handleApply}
            className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
          >
            {t("change_size_modal.save")}
          </button>
        </div>
      </div>
    </div>
  );
}
