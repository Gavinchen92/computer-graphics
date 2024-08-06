import { Point, Vector } from './interface';

// 两个点得到向量
export function vectorFromPoints(x: Point, y: Point): Vector {
  return [x[0] - y[0], x[1] - y[1], x[2] - y[2]];
}

// 计算向量的点积
export function dotProduct(vec1: Point, vec2: Point) {
  return vec1.reduce((sum, value, index) => sum + value * vec2[index], 0);
}

/**
 * 计算向量的模
 *
 * @param {Point} vector - 需要计算模的三维向量
 * @return {number} - 返回向量的模
 */
export function vectorNorm(vector: Point): number {
  return Math.sqrt(vector[0] ** 2 + vector[1] ** 2 + vector[2] ** 2);
}

export function normalizeVector(vector: Vector) {
  const magnitude = vectorNorm(vector);

  // 检查模是否为零（避免除以零的错误）
  if (magnitude === 0) {
    throw new Error('Cannot normalize a zero vector');
  }

  // 将向量的每个分量除以模
  return vector.map((component) => component / magnitude) as Vector;
}

/**
 * 将一个三维向量的每个分量乘以一个标量值
 * @param point - 三维向量，用一个数组表示
 * @param scalar - 标量值
 * @return 新的三维向量，每个分量都是原向量分量乘以标量值的结果
 */
export function multiplyPointByScalar(point: Point, scalar: number): Point {
  return [point[0] * scalar, point[1] * scalar, point[2] * scalar];
}
