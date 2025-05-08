// 📌 Цены на материалы (в сомах)
export const MATERIALS = {
    Фанера: { "3mm": 495, "5mm": 835 },
    Акрил: { "3mm": 9600, "5mm": 10121 },
  };
  
  // 📌 Скорость резки (см/с) в зависимости от толщины
  export const CUTTING_SPEEDS = {
    "3mm": 25,
    "5mm": 20,
  };
  
  // 📌 Скорость гравировки (см²/с)
  export const ENGRAVING_SPEED = 7;
  
  // 📌 Стоимость работы лазера (сом/с)
  export const COST_PER_SECOND = 5;
  
  // 📌 Коэффициент пересчёта пикселей в сантиметры
  export const PX_TO_CM = 37.8; // 1 см ≈ 37.8 px
  
  // 📌 Ограничения размеров
  export const MAX_SIZE = 150; // Максимальный размер изделия (см)
  export const MIN_SIZE = 1;   // Минимальный размер изделия (см)
  