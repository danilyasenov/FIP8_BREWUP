import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { API_URL } from "../config";

export default function RegisterForm() {
  const { t } = useTranslation();

  // Состояния для полей и обработки ошибок/загрузки
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Обработка отправки формы регистрации
  const handleRegister = async (e) => {
    e.preventDefault();

    // Проверка длины пароля
    if (password.length < 6) {
      setError(t("auth.password_too_short"));
      return;
    }

    // Проверка совпадения пароля и подтверждения
    if (password !== confirm) {
      setError(t("auth.password_mismatch"));
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        toast.success(t("auth.register_success"));
        navigate("/login"); // Переход на страницу логина
      } else {
        const data = await response.json();
        // Вывод ошибок от бэкенда
        if (data && data.email) {
          setError(data.email.join(" "));
        } else {
          setError(t("auth.register_error"));
        }
      }
    } catch (err) {
      console.error(err);
      setError(t("auth.connection_error"));
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-900 px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md space-y-6">
        
        {/* Заголовок формы */}
        <h2 className="text-2xl font-bold text-center text-blue-700">{t("auth.register_title")}</h2>

        {/* Форма регистрации */}
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Ошибка валидации или от сервера */}
          {error && (
            <div className="text-red-600 font-medium text-sm bg-red-100 rounded p-2">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">{t("auth.email")}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          {/* Пароль */}
          <div>
            <label className="block text-sm font-medium text-gray-700">{t("auth.password")}</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          {/* Подтверждение пароля */}
          <div>
            <label className="block text-sm font-medium text-gray-700">{t("auth.confirm_password")}</label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          {/* Кнопка регистрации */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? t("auth.registering") : t("auth.to_register")}
          </button>
        </form>

        {/* Ссылка на вход */}
        <p className="text-center text-sm text-gray-600">
          {t("auth.have_account")}{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            {t("auth.to_login")}
          </Link>
        </p>
      </div>
    </div>
  );
}
