import {
  PX_TO_CM,
  CUTTING_SPEEDS,
  ENGRAVING_SPEED,
  COST_PER_SECOND,
} from "./constants";

/**
 * Расчёт стоимости и времени работы лазера
 * @param {Object} params
 * @param {"cutting"|"engraving"} params.mode
 * @param {string} params.thickness
 * @param {number} params.widthCm
 * @param {number} params.heightCm
 * @param {number} params.initialWidthCm
 * @param {number} params.initialHeightCm
 * @param {number} params.vectorLength - в пикселях
 * @param {number} params.materialCost - цена за весь лист 150x150 см
 */
export function calculateLaserJob({
  mode,
  thickness,
  widthCm,
  heightCm,
  initialWidthCm,
  initialHeightCm,
  vectorLength,
  materialCost,
}) {
  const area = widthCm * heightCm;

  // 🔁 Масштабирование вектора (в пикселях) относительно исходного размера
  const scaleFactor = widthCm / initialWidthCm;
  const scaledVectorLengthPx = vectorLength * scaleFactor;
  const scaledVectorLengthCm = scaledVectorLengthPx / PX_TO_CM;

  let operationTime = 0;
  let work = 0;

  if (mode === "cutting") {
    operationTime = scaledVectorLengthCm / CUTTING_SPEEDS[thickness];
    work = scaledVectorLengthCm;
  } else {
    operationTime = area / ENGRAVING_SPEED;
    work = area;
  }

  // 💰 Расчёт пропорциональной стоимости материала
  const fullSheetArea = 150 * 150; // см²
  const materialCostPerCm2 = materialCost / fullSheetArea;
  const usedMaterialCost = area * materialCostPerCm2;

  const totalCost = operationTime * COST_PER_SECOND + usedMaterialCost;

  return {
    operationTime,
    totalCost,
    work,
  };
}
