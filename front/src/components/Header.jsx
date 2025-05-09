import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import header_logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import ButtonLink from "./ui/ButtonLink";
import { useTranslation } from "react-i18next";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Выход из аккаунта
  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  // Открытие/закрытие мобильного меню
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  // Стили для кнопок навигации
  const linkClasses = (path) =>
    `px-4 py-2 rounded-lg transition text-center ${
      location.pathname === path
        ? "bg-blue-700 text-white"
        : "bg-blue-600 text-white hover:bg-blue-700"
    }`;

  // Компонент переключения языка
  const LanguageSwitcher = ({ isMobile = false }) => {
    const langBtn = (code, label) => (
      <button
        key={code}
        onClick={() => {
          i18n.changeLanguage(code);
          if (isMobile) setMenuOpen(false);
        }}
        className={`px-3 py-1 rounded-md font-semibold text-sm transition ${
          i18n.language === code
            ? "bg-white text-blue-900"
            : "bg-blue-700 text-white hover:bg-blue-600"
        }`}
      >
        {label}
      </button>
    );

    return (
      <div className={`flex ${isMobile ? "flex-col gap-2 mt-3" : "space-x-2 ml-4"}`}>
        {langBtn("ru", "🇷🇺")}
        {langBtn("en", "🇺🇸")}
        {langBtn("kg", "🇰🇬")}
      </div>
    );
  };

  return (
    <nav className="bg-blue-950 p-4 shadow-md relative">
      <div className="container mx-auto flex justify-between items-center">
        {/* Логотип */}
        <Link to="/" onClick={closeMenu}>
          <img src={header_logo} alt="Logo" className="h-12 w-auto" />
        </Link>

        {/* Бургер-кнопка — только на мобильных */}
        <button
          onClick={toggleMenu}
          className="text-white text-3xl md:hidden focus:outline-none"
        >
          ☰
        </button>

        {/* Навигация и переключатель языка — десктоп */}
        <div className="hidden md:flex items-center space-x-4">
          <ButtonLink to="/" className={linkClasses("/")}>{t("nav.home")}</ButtonLink>
          <ButtonLink to="/calculator" className={linkClasses("/calculator")}>{t("nav.calculator")}</ButtonLink>
          <ButtonLink to="/orders" className={linkClasses("/orders")}>{t("nav.orders")}</ButtonLink>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="ml-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              {t("nav.logout")}
            </button>
          ) : (
            <>
              <ButtonLink to="/login" className="ml-2">{t("nav.login")}</ButtonLink>
              <ButtonLink to="/register">{t("nav.register")}</ButtonLink>
            </>
          )}

          <LanguageSwitcher />
        </div>
      </div>

      {/* Мобильное меню */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-2 bg-blue-800 p-4 rounded-xl shadow-lg">
          <ButtonLink to="/" onClick={closeMenu} className="w-full text-center">{t("nav.home")}</ButtonLink>
          <ButtonLink to="/calculator" onClick={closeMenu} className="w-full text-center">{t("nav.calculator")}</ButtonLink>
          <ButtonLink to="/orders" onClick={closeMenu} className="w-full text-center">{t("nav.orders")}</ButtonLink>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-center"
            >
              {t("nav.logout")}
            </button>
          ) : (
            <>
              <ButtonLink to="/login" onClick={closeMenu} className="w-full text-center">{t("nav.login")}</ButtonLink>
              <ButtonLink to="/register" onClick={closeMenu} className="w-full text-center">{t("nav.register")}</ButtonLink>
            </>
          )}

          <LanguageSwitcher isMobile />
        </div>
      )}
    </nav>
  );
}
