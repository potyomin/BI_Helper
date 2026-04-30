type RgbColor = {
  r: number;
  g: number;
  b: number;
};

type HslColor = {
  h: number;
  s: number;
  l: number;
};

export const isValidHex = (value: string): boolean => /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim());

export const normalizeHex = (value: string): string => {
  const clean = value.trim().replace(/^#/, "");
  if (clean.length === 3) {
    const expanded = clean
      .split("")
      .map((char) => `${char}${char}`)
      .join("");
    return `#${expanded.toUpperCase()}`;
  }
  return `#${clean.toUpperCase()}`;
};

export const hexToRgb = (value: string): RgbColor | null => {
  if (!isValidHex(value)) {
    return null;
  }

  const hex = normalizeHex(value).replace("#", "");
  const bigint = Number.parseInt(hex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
};

export const rgbToHsl = ({ r, g, b }: RgbColor): HslColor => {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;

  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;

  let hue = 0;
  if (delta !== 0) {
    switch (max) {
      case rn:
        hue = ((gn - bn) / delta) % 6;
        break;
      case gn:
        hue = (bn - rn) / delta + 2;
        break;
      default:
        hue = (rn - gn) / delta + 4;
    }
  }

  hue = Math.round(hue * 60);
  if (hue < 0) {
    hue += 360;
  }

  const lightness = (max + min) / 2;
  const saturation =
    delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

  return {
    h: hue,
    s: Math.round(saturation * 100),
    l: Math.round(lightness * 100),
  };
};

export const hexToHsl = (value: string): HslColor | null => {
  const rgb = hexToRgb(value);
  if (!rgb) {
    return null;
  }
  return rgbToHsl(rgb);
};

export const formatRgb = (rgb: RgbColor): string => `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

export const formatHsl = (hsl: HslColor): string => `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

