import chroma from 'chroma-js';

type Color = chroma.ColorSpaces['rgb'];

const blendColorsCache = new Map<string, chroma.ColorSpaces['rgb']>();

/**
 * 将两个颜色叠加
 * @param {Color} color1 - 底层颜色
 * @param {Color} color2 - 上层颜色
 * @returns {string} 叠加后的颜色，以十六进制格式返回
 */
export function blendColors(
  color1: Color,
  color2: Color,
): chroma.ColorSpaces['rgb'] {
  const cacheKey = `${color1}-${color2}`;
  if (blendColorsCache.has(cacheKey)) {
    return blendColorsCache.get(cacheKey)!;
  }

  const blended = color1.map((c1, i) => {
    const c2 = color2[i];
    return Math.round(255 - ((255 - c1) * (255 - c2)) / 255);
  }) as [number, number, number];

  blendColorsCache.set(cacheKey, blended);
  return blended;
}

/**
 * 将颜色乘以一个因子
 * @param {[number, number, number]} color - 输入颜色
 * @param {number} factor - 乘法因子（0到1之间）
 * @returns {[number, number, number]} 乘法后的颜色
 */
export function multiplyColor(
  color: [number, number, number],
  factor: number,
): [number, number, number] {
  return color.map((c) => Math.round(c * factor)) as [number, number, number];
}

// 为函数添加缓存属性
multiplyColor.cache = new Map<string, [number, number, number]>();
