import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { API_URL } from "../../config";

export default function OrderModal({ order, onClose, onDelete, onResend }) {
  const modalRef = useRef(null);
  const { t } = useTranslation();

  // Закрытие модалки при клике вне её области
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Карта статусов (не используется напрямую, т.к. есть i18n)
  const statusMap = {
    waiting: "Ожидание",
    accepted: "Принят",
    rejected: "Отклонён",
    in_progress: "В процессе",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center px-4">
      <div
        ref={modalRef}
        className="bg-white rounded-xl p-6 shadow-xl w-full max-w-lg space-y-4"
      >
        {/* Заголовок с номером заказа */}
        <h2 className="text-2xl font-bold text-blue-700 mb-2">
          📝 {t("order_modal.title", { id: order.id })}
        </h2>

        {/* Превью SVG-файла */}
        <div className="flex justify-center">
          <img
            src={`${order.file}?t=${Date.now()}`} // предотвращает кеширование
            alt="SVG"
            className="w-48 h-48 object-contain border p-2 rounded bg-gray-100"
          />
        </div>

        {/* Основная информация о заказе */}
        <div className="grid grid-cols-2 gap-3 text-sm text-gray-800">
          <p><strong>{t("order_modal.file")}:</strong> {order.file?.split("/").pop()}</p>
          <p><strong>{t("order_modal.mode")}:</strong> {t(`calculator.modes.${order.mode}`)}</p>
          <p><strong>{t("order_modal.material")}:</strong> {t(`materials.${order.material}`)}</p>
          <p><strong>{t("order_modal.thickness")}:</strong> {order.thickness}</p>
          <p><strong>{t("order_modal.width")}:</strong> {order.width} см</p>
          <p><strong>{t("order_modal.height")}:</strong> {order.height} см</p>
          <p><strong>{t("order_modal.work")}:</strong> {order.work} см</p>
          <p><strong>{t("order_modal.laser")}:</strong> {order.laser_work} сек</p>
          <p><strong>{t("order_modal.price")}:</strong> {order.price} сом</p>
          <p><strong>{t("order_modal.status")}:</strong> {t(`orders.status_${order.status}`)}</p>
        </div>

        {/* Комментарий при отказе */}
        {order.status === "rejected" && order.comment && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
            <strong>{t("orders.comment")}:</strong>
            <p>{order.comment}</p>
          </div>
        )}

        {/* Действия с заказом (повторная отправка, удаление, скачивание) */}
        <div className="flex justify-end space-x-3 mt-4">
          {order.status === "rejected" && (
            <>
              <button
                onClick={() => onResend(order.id)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
              >
                🔁 {t("orders.resend")}
              </button>
              <button
                onClick={() => onDelete(order.id)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                🗑 {t("orders.delete")}
              </button>
              <a
                href={`${API_URL}/orders/${order.id}/download/`}
                className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                {t("orders.download")}
              </a>
            </>
          )}
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            {t("orders.close")}
          </button>
        </div>
      </div>
    </div>
  );
}
