import chroma from 'chroma-js';
import { RGB } from '../interface';
import { multiplyColor } from '../color';

type Ratio = number & { __brand: 'Ratio' };

interface Point2D {
  x: number;
  y: number;
}

interface Point3D extends Point2D {
  z: number;
}

interface Point2DWithRatio extends Point2D {
  h: Ratio;
}

/**
 * 创建一个比率值
 * @param n 输入的数值
 * @returns 转换后的Ratio类型
 */
function createRatio(n: number): Ratio {
  if (n > 1 || n < 0) {
    throw new Error('n must be between 0 and 1');
  }
  return n as Ratio;
}

/**
 * 线性插值函数
 * 在两个给定点之间进行线性插值，生成一系列中间值
 * @param i0 起始点的索引
 * @param d0 起始点的值
 * @param i1 结束点的索引
 * @param d1 结束点的值
 * @returns 包含插值结果的数组
 */
function interpolate(i0: number, d0: number, i1: number, d1: number) {
  if (i0 === i1) {
    return [d0];
  }

  const values = [];
  const a = (d1 - d0) / (i1 - i0);
  let d = d0;

  for (let i = i0; i <= i1; i++) {
    values.push(d);
    d += a;
  }

  return values;
}

class Canvas {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;

  /** 视口宽度 */
  viewportWidth = 4;
  /** 视口高度 */
  viewportHeight = 4;
  /** 视口深度 */
  depth = 1;

  constructor() {
    const canvas = document.getElementById('c') as HTMLCanvasElement;
    this.ctx = canvas.getContext('2d')!;
    this.width = canvas.width;
    this.height = canvas.height;

    // 将坐标系移动到canvas中心
    this.ctx.translate(this.width / 2, this.height / 2);
    // 翻转y轴,使y轴正方向向上
    this.ctx.scale(1, -1);
  }

  /** 将视口坐标转换为canvas坐标 */
  viewportToCanvas(x: number, y: number) {
    return {
      x: (x * this.width) / this.viewportWidth,
      y: (y * this.height) / this.viewportHeight,
    };
  }

  /** 将3D坐标投影到2D坐标 */
  projectVertex(v: Point3D): Point2D {
    return this.viewportToCanvas(
      (v.x * this.depth) / v.z,
      (v.y * this.depth) / v.z,
    );
  }

  /** 绘制像素 */
  putPixel(x: number, y: number, color: RGB) {
    const hexColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    this.ctx.fillStyle = hexColor;
    // 四舍五入确保像素对齐
    this.ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
  }

  /** 绘制直线 */
  drawLine(p0: Point2D, p1: Point2D, color: RGB) {
    const dx = p1.x - p0.x;
    const dy = p1.y - p0.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      // 偏水平方向
      if (p0.x > p1.x) {
        [p0, p1] = [p1, p0];
      }

      const ys = interpolate(p0.x, p0.y, p1.x, p1.y);

      for (let x = p0.x; x <= p1.x; x++) {
        this.putPixel(x, ys[x - p0.x], color);
      }
    } else {
      // 偏垂直方向
      if (p0.y > p1.y) {
        [p0, p1] = [p1, p0];
      }

      const xs = interpolate(p0.y, p0.x, p1.y, p1.x);

      for (let y = p0.y; y <= p1.y; y++) {
        this.putPixel(xs[y - p0.y], y, color);
      }
    }
  }

  /** 绘制线框三角形 */
  drawWireFrameTriangle(p0: Point2D, p1: Point2D, p2: Point2D, color: RGB) {
    this.drawLine(p0, p1, color);
    this.drawLine(p1, p2, color);
    this.drawLine(p2, p0, color);
  }

  /** 绘制填充三角形 */
  drawFilledTriangle(p0: Point2D, p1: Point2D, p2: Point2D, color: RGB) {
    if (p0.y > p1.y) {
      [p0, p1] = [p1, p0];
    }

    if (p1.y > p2.y) {
      [p1, p2] = [p2, p1];
    }

    if (p0.y > p2.y) {
      [p0, p2] = [p2, p0];
    }

    const x01 = interpolate(p0.y, p0.x, p1.y, p1.x);
    const x12 = interpolate(p1.y, p1.x, p2.y, p2.x);
    const x02 = interpolate(p0.y, p0.x, p2.y, p2.x);

    const x012 = x01.slice(0, -1).concat(x12);

    const m = Math.floor(x012.length / 2);

    let xLeft, xRight;
    if (x02[m] < x012[m]) {
      xLeft = x02;
      xRight = x012;
    } else {
      xLeft = x012;
      xRight = x02;
    }

    for (let y = p0.y; y <= p2.y; y++) {
      for (let x = xLeft[y - p0.y]; x <= xRight[y - p0.y]; x++) {
        this.putPixel(x, y, color);
      }
    }
  }

  /** 绘制着色三角形 */
  drawShadedTriangle(
    p0: Point2DWithRatio,
    p1: Point2DWithRatio,
    p2: Point2DWithRatio,
    color: RGB,
  ) {
    if (p0.y > p1.y) {
      [p0, p1] = [p1, p0];
    }

    if (p1.y > p2.y) {
      [p1, p2] = [p2, p1];
    }

    if (p0.y > p2.y) {
      [p0, p2] = [p2, p0];
    }

    const x01 = interpolate(p0.y, p0.x, p1.y, p1.x);
    const h01 = interpolate(p0.y, p0.h, p1.y, p1.h);

    const x12 = interpolate(p1.y, p1.x, p2.y, p2.x);
    const h12 = interpolate(p1.y, p1.h, p2.y, p2.h);

    const x02 = interpolate(p0.y, p0.x, p2.y, p2.x);
    const h02 = interpolate(p0.y, p0.h, p2.y, p2.h);

    const x012 = x01.slice(0, -1).concat(x12);
    const h012 = h01.slice(0, -1).concat(h12);

    const m = Math.floor(x012.length / 2);

    let xLeft, xRight, hLeft, hRight;
    if (x02[m] < x012[m]) {
      xLeft = x02;
      xRight = x012;
      hLeft = h02;
      hRight = h012;
    } else {
      xLeft = x012;
      xRight = x02;
      hLeft = h012;
      hRight = h02;
    }

    for (let y = p0.y; y <= p2.y; y++) {
      const yOffset = y - p0.y;
      const xL = xLeft[yOffset];
      const xR = xRight[yOffset];

      const hSegment = interpolate(xL, hLeft[yOffset], xR, hRight[yOffset]);

      for (let x = xL; x <= xR; x++) {
        const shadedColor = multiplyColor(color, hSegment[x - xL]);

        this.putPixel(x, y, shadedColor);
      }
    }
  }

  /** 绘制三角形 */
  renderTriangle(p0: Point2D, p1: Point2D, p2: Point2D, color: RGB) {
    this.drawWireFrameTriangle(p0, p1, p2, color);
  }

  /** 绘制对象 */
  renderObject(
    vertices: Point3D[],
    triangles: [number, number, number, RGB][],
  ) {
    const projected = vertices.map((v) => this.projectVertex(v));

    triangles.forEach(([i0, i1, i2, color]) => {
      const p0 = projected[i0];
      const p1 = projected[i1];
      const p2 = projected[i2];

      this.renderTriangle(p0, p1, p2, color);
    });
  }
}

const canvas = new Canvas();

export function render() {
  // 偏移向量
  const T = { x: -1.5, y: 0, z: 7 };

  const vertices = [
    { x: -1 + T.x, y: 1 + T.y, z: 1 + T.z }, // 前上左
    { x: 1 + T.x, y: 1 + T.y, z: 1 + T.z }, // 前上右
    { x: -1 + T.x, y: -1 + T.y, z: 1 + T.z }, // 前下左
    { x: 1 + T.x, y: -1 + T.y, z: 1 + T.z }, // 前下右
    { x: -1 + T.x, y: 1 + T.y, z: -1 + T.z }, // 后上左
    { x: 1 + T.x, y: 1 + T.y, z: -1 + T.z }, // 后上右
    { x: -1 + T.x, y: -1 + T.y, z: -1 + T.z }, // 后下左
    { x: 1 + T.x, y: -1 + T.y, z: -1 + T.z }, // 后下右
  ];

  const triangles: [number, number, number, RGB][] = [
    // 前面
    [0, 1, 2, [255, 0, 0]],
    [1, 3, 2, [255, 0, 0]],
    // 后面
    [4, 6, 5, [0, 255, 0]],
    [5, 6, 7, [0, 255, 0]],
    // 上面
    [0, 4, 1, [0, 0, 255]],
    [1, 4, 5, [0, 0, 255]],
    // 下面
    [2, 3, 6, [255, 255, 0]],
    [3, 7, 6, [255, 255, 0]],
    // 左面
    [0, 2, 4, [255, 0, 255]],
    [2, 6, 4, [255, 0, 255]],
    // 右面
    [1, 5, 3, [0, 255, 255]],
    [3, 5, 7, [0, 255, 255]],
  ];

  canvas.renderObject(vertices, triangles);
}