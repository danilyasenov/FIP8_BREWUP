import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import laserImage from "../assets/laser_cutting.jpg";

function Home() {
  const { t } = useTranslation();

  
return (
  <div className="flex h-screen bg-white">
    {/* Левая часть - Изображение */}
    <div className="w-1/2">
      <img
        src={laserImage}
        alt={t("home.image_alt")}
        className="w-full h-full object-cover"
      />
    </div>

    {/* Правая часть - Текст и кнопка */}
    <div className="w-1/2 flex flex-col items-center justify-center text-center p-10">
      <h1 className="text-4xl font-bold mb-4">
        {t("home.title")}
      </h1>
      <p className="text-lg mb-6 max-w-2xl">
        {t("home.description")}
      </p>
      <Link
        to="/calculator"
        className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-bold hover:bg-blue-600 transition"
      >
        {t("home.button")}
      </Link>
    </div>
  </div>
);
}

export default Home;
