/* eslint-disable sonarjs/pseudo-random */
export interface HSLInput {
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
  const hsl = `hsl(${hue.toString()},${saturation.toString()}%,${luminance.toString()}%)` as const;
  return { hsl, h: hue, s: saturation, l: luminance };
};

export type RgbPixel = [number, number, number];

export const rgbToHsl = (...[r, g, b]: RgbPixel) => {
  let d,
    h = 0,
    s = 0;
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max !== min) {
    d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: {
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      }
      case g: {
        h = (b - r) / d + 2;
        break;
      }
      case b: {
        h = (r - g) / d + 4;
      }
    }
    h /= 6;
  }
  return [h * 360, `${(s * 100).toString()}%`, `${(l * 100).toString()}%`];
};
