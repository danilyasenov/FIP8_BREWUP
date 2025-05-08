import React, { useState, useEffect } from "react";
import OrderModal from "../components/modals/OrderModal";
import PaymentPendingModal from "../components/modals/PaymentPendingModal";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { API_URL } from "../config";
import { useNavigate } from "react-router-dom";

const statusColors = {
  waiting: "bg-gray-400",
  rejected: "bg-red-500",
  in_progress: "bg-yellow-400",
  accepted: "bg-green-500",
  payment_pending: "bg-blue-500",
};

export default function UserOrders() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate(); // ✅ ВНЕ УСЛОВИЯ
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchOrders = async () => {
      const token = localStorage.getItem("access");
      if (!token) return;

      try {
        const response = await fetch(`${API_URL}/orders/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Ошибка при получении заказов");
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Ошибка при загрузке заказов:", error);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("access");
    if (!token) return alert("❗ Не авторизован");

    try {
      const response = await fetch(`${API_URL}/orders/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setOrders((prev) => prev.filter((order) => order.id !== id));
        setSelectedOrder(null);
      } else {
        alert("❌ Ошибка при удалении заказа");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Не удалось удалить заказ");
    }
  };

  const handleResend = async (id) => {
    const token = localStorage.getItem("access");
    if (!token) return alert("❗ Не авторизован");

    try {
      const response = await fetch(`${API_URL}/orders/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "waiting", comment: "" }),
      });

      if (response.ok) {
        const updated = await response.json();
        setOrders((prev) =>
          prev.map((order) => (order.id === id ? updated : order))
        );
        setSelectedOrder(null);
      } else {
        alert("❌ Не удалось отправить заказ повторно");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Ошибка при повторной отправке");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-900 text-white px-4 text-center">
        <div className="max-w-xl space-y-6">
          <h1 className="text-3xl font-bold">
            🔒 {t("orders.not_logged_in_title")}
          </h1>
          <p className="text-lg">{t("orders.not_logged_in_message")}</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-white text-blue-900 font-semibold px-6 py-3 rounded-lg hover:bg-gray-200 transition"
            >
              {t("nav.login")}
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-green-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-600 transition"
            >
              {t("nav.register")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-900 text-white p-10">
      <h1 className="text-3xl font-bold mb-6">📦 {t("orders.my_orders")}</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white text-black rounded-lg p-5 shadow-md cursor-pointer hover:shadow-lg transition flex justify-between items-center"
            onClick={() => setSelectedOrder(order)}
          >
            <div>
              <p className="font-semibold text-lg">
                #{order.id} — {order.file?.split("/").pop()}
              </p>
              <p className="text-sm text-gray-700">
                {t("orders.price")}: {order.price} сом
              </p>
            </div>
            <div
              className={`px-4 py-1 rounded-full text-white text-sm font-medium ${statusColors[order.status]}`}
            >
              {t(`orders.status_${order.status}`)}
            </div>
          </div>
        ))}
      </div>

      {selectedOrder?.status === "payment_pending" ? (
        <PaymentPendingModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      ) : selectedOrder ? (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onDelete={handleDelete}
          onResend={handleResend}
        />
      ) : null}
    </div>
  );
}
