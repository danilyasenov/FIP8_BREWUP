import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

function SuccessModal({ visible, onClose }) {
  const { t } = useTranslation();

  // Автоматическое закрытие модалки через 3 секунды после появления
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [visible, onClose]);

  // Если модалка не должна отображаться — ничего не рендерим
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-xl text-center max-w-md w-full mx-4 animate-fade-in">
        {/* Иконка успеха */}
        <div className="text-4xl mb-3">✅</div>

        {/* Заголовок */}
        <h2 className="text-2xl font-bold text-green-600 mb-2">
          {t("success_modal.title")}
        </h2>

        {/* Описание */}
        <p className="text-gray-700 mb-4">
          {t("success_modal.description")}
        </p>

        {/* Кнопка "ОК" */}
        <button
          onClick={onClose}
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
        >
          {t("success_modal.ok")}
        </button>
      </div>
    </div>
  );
}

export default SuccessModal;
