import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // используем BrowserRouter для нормальных URL
import Header from "./components/Header";
import Home from "./pages/Home";
import Calculator from "./pages/Calculator";
import NotFound from "./pages/NotFound";
import UserOrders from "./pages/UserOrders";
import LoginForm from "./pages/LoginForm";
import RegisterForm from "./pages/RegisterForm";
import { Toaster } from "react-hot-toast"; // всплывающие уведомления
import "./i18n/i18n"; // подключение мультиязычности

function App() {
  return (
    <Router>
      {/* Компонент уведомлений */}
      <Toaster position="top-right" />

      {/* Шапка сайта */}
      <Header />

      {/* Маршруты */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/orders" element={<UserOrders />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Обработка несуществующих маршрутов */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
