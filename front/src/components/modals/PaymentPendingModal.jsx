import React from "react";
import { useTranslation } from "react-i18next";
import qrImage from "../../assets/oplata.png"; // поставь туда любую заглушку

export default function PaymentPendingModal({ orderId, onClose }) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center px-4">
      <div className="bg-white rounded-xl p-6 shadow-xl w-full max-w-md space-y-4 text-center">
        <h2 className="text-2xl font-bold text-blue-700 mb-2">
          💳 {t("orders.payment_pending_title")}
        </h2>

        <img
          src={qrImage}
          alt="QR code"
          className="mx-auto w-48 h-48 object-contain border p-2 bg-gray-100 rounded"
        />

        <div className="text-sm text-gray-800 space-y-2">
          <p>{t("orders.payment_pending_instruction", { id: orderId })}</p>
          <p>{t("orders.payment_pending_note")}</p>
        </div>

        <button
          onClick={onClose}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
        >
          {t("orders.close")}
        </button>
      </div>
    </div>
  );
}
