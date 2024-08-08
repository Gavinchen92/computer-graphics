import { Point, Vector } from './interface';

/**
 * 计算从点y到点x的向量
 * @param {Point} x - 向量的终点
 * @param {Point} y - 向量的起点
 * @returns {Vector} 从y指向x的向量
 */
export function calculateVectorFromPoints(x: Point, y: Point): Vector {
  return [x[0] - y[0], x[1] - y[1], x[2] - y[2]];
}

/**
 * 计算两个向量的点积
 * @param {Point} vec1 - 第一个向量
 * @param {Point} vec2 - 第二个向量
 * @returns {number} 两个向量的点积
 */
export function calculateDotProduct(vec1: Point, vec2: Point) {
  return vec1.reduce((sum, value, index) => sum + value * vec2[index], 0);
}

/**
 * 计算向量的模
 *
 * @param {Point} vector - 需要计算模的三维向量
 * @return {number} - 返回向量的模
 */
export function calculateVectorMagnitude(vector: Point): number {
  return Math.sqrt(vector[0] ** 2 + vector[1] ** 2 + vector[2] ** 2);
}

/**
 * 将向量归一化（标准化）
 *
 * @param {Vector} vector - 需要归一化的向量
 * @returns {Vector} 归一化后的向量
 * @throws {Error} 如果输入是零向量，则抛出错误
 */
export function normalizeVector(vector: Vector) {
  const magnitude = calculateVectorMagnitude(vector);

  // 检查模是否为零（避免除以零的错误）
  if (magnitude === 0) {
    throw new Error('无法对零向量进行归一化');
  }

  // 将向量的每个分量除以模
  return vector.map((component) => component / magnitude) as Vector;
}

/**
 * 将一个三维向量的每个分量乘以一个标量值
 * @param vector - 三维向量，用一个数组表示
 * @param scalar - 标量值
 * @return 新的三维向量，每个分量都是原向量分量乘以标量值的结果
 */
export function multiplyVectorByScalar(vector: Point, scalar: number): Point {
  return [vector[0] * scalar, vector[1] * scalar, vector[2] * scalar];
}

/**
 * 计算两个向量的差
 *
 * @param {Vector} v1 - 第一个向量
 * @param {Vector} v2 - 第二个向量
 * @returns {Vector} 返回两个向量相减的结果
 */
export function subtractVectors(v1: Vector, v2: Vector): Vector {
  return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]];
}