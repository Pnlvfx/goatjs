/* eslint-disable sonarjs/pseudo-random */
export const generateRandomColor = (type?: 'light' | 'dark') => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 100);
  let lightness;

  if (type === 'light') {
    lightness = 70 + Math.random() * 30; // 70-100%
  } else if (type === 'dark') {
    lightness = Math.random() * 30; // 0-30%
  } else {
    lightness = Math.random() * 100; // Any lightness
  }

  return `hsl(${hue.toString()}, ${saturation.toString()}%, ${lightness.toFixed(1)}%)`;
};
