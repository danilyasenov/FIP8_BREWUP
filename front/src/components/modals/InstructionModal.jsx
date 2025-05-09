import React from "react";
import { useTranslation } from "react-i18next";

function InstructionModal({ visible, onClose }) {
  const { t } = useTranslation();

  // Если модалка неактивна — ничего не рендерим
  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg relative">

        {/* Кнопка закрытия модалки */}
        <button
          className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-700"
          onClick={onClose}
        >
          ✖
        </button>

        {/* Заголовок и общее напоминание */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          📌 {t("instruction_modal.title")}
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          {t("instruction_modal.svg_tip")}
        </p>

        {/* Блок: инструкции по вырезке */}
        <h3 className="text-lg font-semibold text-blue-600">
          {t("instruction_modal.cutting_title")}
        </h3>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li>{t("instruction_modal.cutting_1")}</li>
          <li>{t("instruction_modal.cutting_2")}</li>
          <li>{t("instruction_modal.cutting_3")}</li>
          <li>{t("instruction_modal.cutting_4")}</li>
          <li>{t("instruction_modal.cutting_5")}</li>
        </ul>

        {/* Блок: инструкции по гравировке */}
        <h3 className="text-lg font-semibold text-green-600">
          {t("instruction_modal.engraving_title")}
        </h3>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li>{t("instruction_modal.engraving_1")}</li>
          <li>{t("instruction_modal.engraving_2")}</li>
          <li>{t("instruction_modal.engraving_3")}</li>
          <li>{t("instruction_modal.engraving_4")}</li>
        </ul>

        {/* Важное предупреждение в конце */}
        <p className="text-red-600 font-semibold">
          {t("instruction_modal.warning")}
        </p>
      </div>
    </div>
  );
}

export default InstructionModal;
