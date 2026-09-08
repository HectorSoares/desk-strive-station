
export function getColorByPercentage(percentage: number, colorsArray: string[]): string {
  if (percentage <= 0) return colorsArray[0];
  if (percentage >= 100) return colorsArray[colorsArray.length - 1];

  const index = Math.floor((percentage / 100) * (colorsArray.length - 1));
  return colorsArray[index];
}