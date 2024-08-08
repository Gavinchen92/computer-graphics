type RGBColor = [number, number, number];
type RGBObject = { r: number; g: number; b: number };
type Color = string | RGBObject;

/**
 * 将两个颜色叠加
 * @param {Color} color1 - 底层颜色
 * @param {Color} color2 - 上层颜色
 * @returns {string} 叠加后的颜色，以十六进制格式返回
 */
export function blendColors(color1: Color, color2: Color): string {
  // 解析两个颜色
  const rgb1 = parseColor(color1);
  const rgb2 = parseColor(color2);

  // 使用简单的叠加算法：(a + b) - (a * b / 255)
  const blendedRGB: RGBColor = [
    Math.round(rgb1[0] + rgb2[0] - (rgb1[0] * rgb2[0]) / 255),
    Math.round(rgb1[1] + rgb2[1] - (rgb1[1] * rgb2[1]) / 255),
    Math.round(rgb1[2] + rgb2[2] - (rgb1[2] * rgb2[2]) / 255)
  ];

  // 确保结果在0-255范围内
  const clampedRGB = blendedRGB.map(value => Math.min(255, Math.max(0, value))) as RGBColor;

  // 返回十六进制格式的颜色
  return rgbToHex(clampedRGB);
}


export function multiplyColor(color: Color, factor: number): string {
  // 解析颜色
  let rgb: RGBColor = parseColor(color);

  // 确保因子在0到1之间
  factor = Math.max(0, Math.min(1, factor));

  // 将每个颜色分量乘以因子，并四舍五入到整数
  rgb = rgb.map((value) => Math.round(value * factor)) as RGBColor;

  // 确保结果在0-255范围内
  rgb = rgb.map((value) => Math.min(255, Math.max(0, value))) as RGBColor;

  // 返回十六进制格式的颜色
  return rgbToHex(rgb);
}

function parseColor(color: Color): RGBColor {
  // 处理十六进制
  if (typeof color === 'string' && color.startsWith('#')) {
    return hexToRgb(color);
  }

  // 处理 rgb() 或 rgba()
  if (
    typeof color === 'string' &&
    (color.startsWith('rgb') || color.startsWith('rgba'))
  ) {
    return color.match(/\d+/g)?.map(Number).slice(0, 3) as RGBColor;
  }

  // 处理颜色名称
  if (typeof color === 'string') {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = color;
      const hex = ctx.fillStyle;
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b];
    }
  }

  // 处理 {r, g, b} 对象
  if (
    typeof color === 'object' &&
    'r' in color &&
    'g' in color &&
    'b' in color
  ) {
    return [color.r, color.g, color.b];
  }

  throw new Error('Unsupported color format');
}

function hexToRgb(hex: string): RGBColor {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  const bigint = parseInt(hex, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function rgbToHex(rgb: RGBColor): string {
  return (
    '#' +
    rgb
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
}
