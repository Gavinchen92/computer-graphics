interface Point2D {
  x: number;
  y: number;
}

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

  /** 绘制像素 */
  putPixel(x: number, y: number, color: string) {
    this.ctx.fillStyle = color;
    // 四舍五入确保像素对齐
    this.ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
  }

  /** 绘制直线 */
  drawLine(p0: Point2D, p1: Point2D, color: string) {
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
  drawTriangle(p0: Point2D, p1: Point2D, p2: Point2D, color: string) {
    this.drawLine(p0, p1, color);
    this.drawLine(p1, p2, color);
    this.drawLine(p2, p0, color);
  }

  /** 绘制填充三角形 */
  drawFilledTriangle(p0: Point2D, p1: Point2D, p2: Point2D, color: string) {
    if (p1.y > p2.y) {
      [p1, p2] = [p2, p1];
    }

    if (p0.y > p1.y) {
      [p0, p1] = [p1, p0];
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
}

const canvas = new Canvas();

export function render() {
  // 现在可以使用相对于中心点的坐标
  canvas.drawTriangle(
    { x: -200, y: -250 },
    { x: 200, y: 50 },
    { x: 20, y: 250 },
    'red',
  );

  canvas.drawFilledTriangle(
    { x: -200, y: -250 },
    { x: 200, y: 50 },
    { x: 20, y: 250 },
    'green',
  );
}
