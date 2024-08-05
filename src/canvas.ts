const canvasEle = document.getElementById('c') as HTMLCanvasElement;

canvasEle.width = canvasEle.clientWidth;
canvasEle.height = canvasEle.clientHeight;

const canvasWidth = canvasEle.width;
const canvasHeight = canvasEle.height;

const canvas = canvasEle.getContext('2d')!;

type Point = [number, number, number];

interface Sphere {
  center: Point;
  radius: number;
  color: string;
}

const OriginalPoint: Point = [0, 0, 0];

const Spheres: Sphere[] = [
  { center: [0, -1, 3], radius: 1, color: 'red' },
  { center: [2, 0, 4], radius: 1, color: 'green' },
  { center: [-2, 0, 4], radius: 1, color: 'blue' },
];

const BackgroundColor = 'white';

const plantD = 1;
const viewportWidth = 1;
const viewportHeight = 1;

// 两个点得到向量
function subtractPoint(x: Point, y: Point): Point {
  return [x[0] - y[0], x[1] - y[1], x[2] - y[2]];
}

// 计算向量的点积
function dotProduct(vec1: Point, vec2: Point) {
  return vec1.reduce((sum, value, index) => sum + value * vec2[index], 0);
}

// 绘制一个像素点
export function putPixel(x: number, y: number, color: string) {
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
export function canvas2viewport(x: number, y: number): Point {
  return [
    (x * viewportWidth) / canvasWidth,
    (y * viewportHeight) / canvasHeight,
    plantD,
  ];
}

export function traceRay(O: Point, D: Point, tMin: number, tMax: number) {
  let closestT = Infinity;
  let closestSphere: Sphere | null = null;

  for (const sphere of Spheres) {
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

  return closestSphere.color;
}

export function intersectRaySphere(O: Point, D: Point, sphere: Sphere) {
  const { center, radius } = sphere;
  const co = subtractPoint(O, center);

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

for (let x = -canvasWidth / 2; x <= canvasWidth / 2; x++) {
  for (let y = -canvasHeight / 2; y <= canvasHeight / 2; y++) {
    const D = canvas2viewport(x, y);

    // console.log('d', D);

    const color = traceRay(OriginalPoint, D, 1, Infinity);

    putPixel(x, y, color);
  }
}
