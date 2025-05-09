import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-900 text-white px-4 text-center">
      {/* Заголовок 404 */}
      <h1 className="text-7xl font-extrabold mb-4">404</h1>

      {/* Подзаголовок */}
      <h2 className="text-2xl font-semibold mb-2">Страница не найдена</h2>

      {/* Сообщение пользователю */}
      <p className="text-lg mb-6">Упс! Похоже, вы попали не туда.</p>

      {/* Кнопка возврата на главную */}
      <Link
        to="/"
        className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition"
      >
        ⬅️ Вернуться на главную
      </Link>
    </div>
  );
}

export default NotFound;
