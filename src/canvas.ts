import { blendColors, multiplyColor } from './color';
import { DirectionalLight, PointLight } from './components/light';
import { Scene } from './components/scene';
import { Sphere } from './components/sphere';
import { Point, Vector } from './interface';
import {
  calculateDotProduct,
  multiplyVectorByScalar,
  normalizeVector,
  subtractVectors,
  calculateVectorFromPoints,
  calculateVectorMagnitude,
  negateVector,
} from './utits';

const canvasEle = document.getElementById('c') as HTMLCanvasElement;

canvasEle.width = canvasEle.clientWidth;
canvasEle.height = canvasEle.clientHeight;

const canvasWidth = canvasEle.width;
const canvasHeight = canvasEle.height;

const canvas = canvasEle.getContext('2d')!;

const OriginalPoint: Point = [0, 0, 0];

const BackgroundColor = '#000000';

const plantD = 1;
const viewportWidth = 1;
const viewportHeight = 1;

const EPSILON = 1e-6; // 声明一个极小正数

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
 * 计算反射光线的方向向量
 * @param {Vector} R - 入射光线的方向向量
 * @param {Vector} N - 表面法线向量
 * @returns {Vector} 反射光线的方向向量
 */
function reflectRay(R: Vector, N: Vector) {
  return subtractVectors(
    multiplyVectorByScalar(N, 2 * calculateDotProduct(R, N)),
    R,
  );
}

/**
 * 光线追踪函数
 * @param {Point} O - 光线起点（通常是相机位置）
 * @param {Point} D - 光线方向
 * @param {number} tMin - 最小距离（用于避免自相交）
 * @param {number} tMax - 最大距离（用于限制光线追踪的范围）
 * @param {number} recursionDepth - 递归深度（用于限制递归的次数）
 * @returns {string} 光线与场景中物体相交后的颜色
 */
function traceRay(
  scene: Scene,
  O: Point,
  D: Point,
  tMin: number,
  tMax: number,
  recursionDepth: number = 0,
): string {
  const [closestSphere, closestT] = closestIntersection(
    scene,
    O,
    D,
    tMin,
    tMax,
  );

  if (!closestSphere) {
    return BackgroundColor;
  }

  // 计算局部颜色
  const P = calculateVectorFromPoints(multiplyVectorByScalar(D, closestT), O);
  let N = calculateVectorFromPoints(P, closestSphere.center);
  N = normalizeVector(N);

  const i = computeLighting(
    scene,
    P,
    N,
    negateVector(D),
    closestSphere.specular,
  );

  const localColor = multiplyColor(closestSphere.color, i);

  // 如果递归深度大于最大深度或者物体不具有反射性，则返回局部颜色
  if (recursionDepth <= 0 || closestSphere.reflective <= 0) {
    return localColor;
  }

  const R = reflectRay(negateVector(D), N);
  const reflectedColor = traceRay(
    scene,
    P,
    R,
    EPSILON,
    Infinity,
    recursionDepth - 1,
  );

  return blendColors(
    multiplyColor(localColor, 1 - closestSphere.reflective),
    multiplyColor(reflectedColor, closestSphere.reflective),
  );
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
  const co = calculateVectorFromPoints(O, center);

  const a = calculateDotProduct(D, D);
  const b = 2 * calculateDotProduct(co, D);
  const c = calculateDotProduct(co, co) - radius * radius;

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
 * 找到光线与场景中最近的交点
 * @param {Scene} scene - 场景对象
 * @param {Point} O - 光线起点
 * @param {Point} D - 光线方向
 * @param {number} tMin - 最小距离（用于避免自相交）
 * @param {number} tMax - 最大距离（用于限制光线追踪的范围）
 * @returns {[Sphere | null, number]} 返回最近的球体对象和对应的交点参数值
 */
function closestIntersection(
  scene: Scene,
  O: Point,
  D: Point,
  tMin: number,
  tMax: number,
) {
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

  return [closestSphere, closestT] as [Sphere | null, number];
}

/**
 * 计算场景中的光照强度
 * @param {Scene} scene - 场景对象
 * @param {Point} P - 表面上的点
 * @param {Vector} N - 表面法向量
 * @param {Vector} V - 视线
 * @param {number} specular - 光照强度
 * @returns {number} 光照强度
 */
function computeLighting(
  scene: Scene,
  P: Point,
  N: Vector,
  V: Vector,
  specular: number,
) {
  let i = 0;

  for (const light of scene.lights) {
    if (light.type === 'ambient') {
      i += light.intensity;
    } else {
      let L: Vector;
      if (light.type === 'point') {
        L = calculateVectorFromPoints((light as PointLight).position, P);
      } else {
        L = (light as DirectionalLight).direction;
      }

      // 阴影检测
      const [closestSphere] = closestIntersection(
        scene,
        P,
        L,
        EPSILON,
        Infinity,
      );

      if (closestSphere) {
        continue;
      }

      // 漫反射
      const nDotL = calculateDotProduct(N, L);
      if (nDotL > 0) {
        i +=
          (light.intensity * nDotL) /
          (calculateVectorMagnitude(N) * calculateVectorMagnitude(L));
      }

      // 镜面反射
      if (specular !== -2) {
        const R = reflectRay(V, N);
        const nDotR = calculateDotProduct(V, R);
        if (nDotR > 0) {
          i +=
            light.intensity *
            Math.pow(
              nDotR /
                (calculateVectorMagnitude(V) * calculateVectorMagnitude(R)),
              specular,
            );
        }
      }
    }
  }

  return i;
}

export function render(scene: Scene) {
  for (let x = -canvasWidth / 2; x <= canvasWidth / 2; x++) {
    for (let y = -canvasHeight / 2; y <= canvasHeight / 2; y++) {
      const D = canvas2viewport(x, y);

      const color = traceRay(scene, OriginalPoint, D, 1, Infinity, 2);

      putPixel(x, y, color);
    }
  }
}
