const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(n, max));
export const getBubbleWidth = (msgText: string, availableWidth: number) => {
  if (!availableWidth) return undefined; // aun no mide

  // limites (ajusta si quieres)
  const minW = availableWidth * 0.22; // 22%
  const maxW = availableWidth * 0.88; // 88%

  // estimacion: ancho promedio por caracter (fontSize 16 aprox)
  const avgChar = 7.2; // px por caracter aprox (ajustable)
  const base = 40; // padding/espacio minimo
  const ideal = base + msgText.length * avgChar;

  return clamp(ideal, minW, maxW);
};
