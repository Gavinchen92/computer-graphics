import { multiplyColor } from './color';
import { DirectionalLight, PointLight } from './components/light';
import { Scene } from './components/scene';
import { Sphere } from './components/sphere';
import { Point, Vector } from './interface';
import {
  dotProduct,
  multiplyPointByScalar,
  normalizeVector,
  vectorFromPoints,
  vectorNorm,
} from './utits';

const canvasEle = document.getElementById('c') as HTMLCanvasElement;

canvasEle.width = canvasEle.clientWidth;
canvasEle.height = canvasEle.clientHeight;

const canvasWidth = canvasEle.width;
const canvasHeight = canvasEle.height;

const canvas = canvasEle.getContext('2d')!;

const OriginalPoint: Point = [0, 0, 0];

const BackgroundColor = 'white';

const plantD = 1;
const viewportWidth = 1;
const viewportHeight = 1;

// 在画布上绘制一个像素点
function putPixel(x: number, y: number, color: string) {
  const halfH = canvasEle.height / 2;
  const halfW = canvasEle.width / 2;

  if (x > halfW || y > halfH || x < -halfW || y < -halfH) {
    return;
  }

  const trueX = halfW + x;
  const trueY = halfH - y;

  canvas.fillStyle = color;
  canvas.fillRect(trueX, trueY, 1, 1);
}

// canvas坐标转viewport坐标
function canvas2viewport(x: number, y: number): Point {
  return [
    (x * viewportWidth) / canvasWidth,
    (y * viewportHeight) / canvasHeight,
    plantD,
  ];
}

/**
 * 光线追踪函数
 * @param {Point} O - 光线起点（通常是相机位置）
 * @param {Point} D - 光线方向
 * @param {number} tMin - 最小距离（用于避免自相交）
 * @param {number} tMax - 最大距离（用于限制光线追踪的范围）
 * @returns {string} 光线与场景中物体相交后的颜色
 */
function traceRay(
  scene: Scene,
  O: Point,
  D: Point,
  tMin: number,
  tMax: number,
): string {
  let closestT = Infinity;
  let closestSphere: Sphere | null = null;

  for (const sphere of scene.spheres) {
    const [t1, t2] = intersectRaySphere(O, D, sphere);
    if (t1 > tMin && t1 < tMax && t1 < closestT) {
      closestT = t1;
      closestSphere = sphere;
    }

    if (t2 > tMin && t2 < tMax && t2 < closestT) {
      closestT = t2;
      closestSphere = sphere;
    }
  }

  if (!closestSphere) {
    return BackgroundColor;
  }

  const P = vectorFromPoints(multiplyPointByScalar(D, closestT), O);
  let N = vectorFromPoints(P, closestSphere.center);
  N = normalizeVector(N);

  const i = computeLighting(scene, P, N);

  return multiplyColor(closestSphere.color, i);
}

/**
 * 计算光线与球体的交点
 * @param {Point} O - 光线起点
 * @param {Point} D - 光线方向
 * @param {Sphere} sphere - 球体对象
 * @returns {[number, number]} [t1, t2] 表示光线与球体的两个交点对应的参数值
 */
function intersectRaySphere(O: Point, D: Point, sphere: Sphere) {
  const { center, radius } = sphere;
  const co = vectorFromPoints(O, center);

  const a = dotProduct(D, D);
  const b = 2 * dotProduct(co, D);
  const c = dotProduct(co, co) - radius * radius;

  const discriminant = b * b - 4 * a * c;

  if (discriminant < 0) {
    return [Infinity, Infinity];
  }

  return [
    (-b + Math.sqrt(discriminant)) / (2 * a),
    (-b - Math.sqrt(discriminant)) / (2 * a),
  ];
}

/**
 * 计算场景中的光照强度
 * @param {Scene} scene - 场景对象
 * @param {Point} P - 表面上的点
 * @param {Vector} N - 表面法向量
 * @returns {number} 光照强度
 */
function computeLighting(scene: Scene, P: Point, N: Vector) {
  let i = 0;

  for (const light of scene.lights) {
    if (light.type === 'ambient') {
      i += light.intensity;
    } else {
      let L: Vector;
      if (light.type === 'point') {
        L = vectorFromPoints((light as PointLight).position, P);
      } else {
        L = (light as DirectionalLight).direction;
      }

      const nDotL = dotProduct(N, L);

      if (nDotL > 0) {
        i += (light.intensity * nDotL) / (vectorNorm(N) * vectorNorm(L));
      }
    }
  }

  return i;
}

export function render(scene: Scene) {
  for (let x = -canvasWidth / 2; x <= canvasWidth / 2; x++) {
    for (let y = -canvasHeight / 2; y <= canvasHeight / 2; y++) {
      const D = canvas2viewport(x, y);

      const color = traceRay(scene, OriginalPoint, D, 1, Infinity);

      putPixel(x, y, color);
    }
  }
}
