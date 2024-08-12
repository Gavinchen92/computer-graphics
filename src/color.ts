import { RGB } from './interface';

const blendColorsCache = new Map<string, RGB>();

/**
 * 将两个颜色叠加
 * @param {RGB} color1 - 底层颜色
 * @param {RGB} color2 - 上层颜色
 * @returns {RGB} 叠加后的颜色
 */
export function blendColors(color1: RGB, color2: RGB): RGB {
  const cacheKey = `${color1}-${color2}`;
  if (blendColorsCache.has(cacheKey)) {
    return blendColorsCache.get(cacheKey)!;
  }

  const blended = color1.map((c1, i) => {
    const c2 = color2[i];
    return Math.round(255 - ((255 - c1) * (255 - c2)) / 255);
  }) as RGB;

  blendColorsCache.set(cacheKey, blended);
  return blended;
}

/**
 * 将颜色乘以一个因子
 * @param {RGB} color - 输入颜色
 * @param {number} factor - 乘法因子（0到1之间）
 * @returns {RGB} 乘法后的颜色
 */
export function multiplyColor(color: RGB, factor: number): RGB {
  return color.map((c) => Math.round(c * factor)) as RGB;
}

// 为函数添加缓存属性
multiplyColor.cache = new Map<string, RGB>();
