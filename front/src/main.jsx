import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx"; // Контекст аутентификации
import "./i18n/i18n"; // Инициализация мультиязычности

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Обёртка для передачи данных аутентификации всему приложению */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
