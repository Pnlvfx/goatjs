/* eslint-disable sonarjs/pseudo-random */
export const generateDarkColorHex = () => {
  let color = '#';
  for (let i = 0; i < 3; i++) color += ('0' + Math.floor((Math.random() * Math.pow(16, 2)) / 2).toString()).slice(-2);
  return color;
};

export const generateDarkColorRgb = () => {
  const red = Math.floor((Math.random() * 256) / 2);
  const green = Math.floor((Math.random() * 256) / 2);
  const blue = Math.floor((Math.random() * 256) / 2);
  return 'rgb(' + red.toString() + ', ' + green.toString() + ', ' + blue.toString() + ')';
};

export const generateLightColorHex = () => {
  let color = '#';
  for (let i = 0; i < 3; i++) color += ('0' + Math.floor(((1 + Math.random()) * Math.pow(16, 2)) / 2).toString(16)).slice(-2);
  return color;
};

export const generateLightColorRgb = () => {
  const red = Math.floor(((1 + Math.random()) * 256) / 2);
  const green = Math.floor(((1 + Math.random()) * 256) / 2);
  const blue = Math.floor(((1 + Math.random()) * 256) / 2);
  return 'rgb(' + red.toString() + ', ' + green.toString() + ', ' + blue.toString() + ')';
};

interface HSLInput {
  h?: number;
  s?: number;
  l?: number;
}

/**
 * Generates an HSL color string.
 *
 * @param {HSLInput} input - Optional HSL values.
 *   - `h` (Hue): 0-360
 *   - `s` (Saturation): 0-100
 *   - `l` (Lightness): 0-100
 *
 */
export const generateHSLColor = ({ h, s, l }: HSLInput = {}) => {
  return `hsl(${h?.toString() ?? Math.floor(Math.random() * 360).toString()}, 
              ${s?.toString() ?? Math.floor(Math.random() * 101).toString()}%, 
              ${l?.toString() ?? Math.floor(Math.random() * 101).toString()}%)`;
};
