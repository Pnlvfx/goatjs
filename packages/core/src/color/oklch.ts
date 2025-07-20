/* eslint-disable sonarjs/pseudo-random */
export interface OKLCHInput {
  /** Lightness: 0-1 */
  l?: number;
  /** Chroma 0-0.4 tipically */
  c?: number;
  /** Hue 0-360 */
  h?: number;
}

export type OklchPixel = [number, number, number];

/** Generate a random OKLCH color */
export const generateOKLCHColor = ({ c, h, l }: OKLCHInput) => {
  const lightness = l ?? Math.random(); // 0-1
  const chroma = c ?? Math.random() * 0.4; // 0-0.4 for reasonable colors
  const hue = h ?? Math.floor(Math.random() * 360); // 0-360
  return [lightness, chroma, hue] as OklchPixel;
};
