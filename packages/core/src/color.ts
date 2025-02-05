/* eslint-disable sonarjs/pseudo-random */
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
  const hue = h ?? Math.floor(Math.random() * 360);
  const saturation = s ?? Math.floor(Math.random() * 101);
  const luminance = l ?? Math.floor(Math.random() * 101);
  const color = `hsl(${hue.toString()},${saturation.toString()}%,${luminance.toString()}%)`;
  return { value: color, h: hue, s: saturation, l: luminance };
};
