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

/**
 * 对向量取反
 *
 * @param {Vector} vector - 需要取反的向量
 * @returns {Vector} 取反后的新向量
 */
export function negateVector(vector: Vector): Vector {
  return [-vector[0], -vector[1], -vector[2]];
}

/**
 * 对向量应用旋转变换
 *
 * @param {Vector} vector - 需要旋转的向量
 * @param {number} rotation - 旋转角度（以弧度为单位）
 * @param {string} axis - 旋转轴，可选值为 'x', 'y', 或 'z'
 * @returns {Vector} 旋转后的新向量
 *
 * 这个函数将给定的向量围绕指定轴旋转指定的角度。
 * 旋转使用3D旋转矩阵进行计算。
 * 正角度表示逆时针旋转，负角度表示顺时针旋转。
 */
export function applyRotation(
  vector: Vector,
  rotation: { x: number; y: number; z: number },
): Vector {
  let [x, y, z] = vector;

  // 绕X轴旋转
  const cosX = Math.cos(rotation.x);
  const sinX = Math.sin(rotation.x);
  [y, z] = [y * cosX - z * sinX, y * sinX + z * cosX];

  // 绕Y轴旋转
  const cosY = Math.cos(rotation.y);
  const sinY = Math.sin(rotation.y);
  [x, z] = [z * sinY + x * cosY, z * cosY - x * sinY];

  // 绕Z轴旋转
  const cosZ = Math.cos(rotation.z);
  const sinZ = Math.sin(rotation.z);
  [x, y] = [x * cosZ - y * sinZ, x * sinZ + y * cosZ];

  return [x, y, z];
}

/**
 * 计算两个点之间的绝对距离
 * @param {Point} p1 - 第一个点
 * @param {Point} p2 - 第二个点
 * @returns {number} 两点之间的绝对距离
 */
export function calculateAbsoluteDistance(p1: Point, p2: Point): number {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const dz = p2[2] - p1[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}