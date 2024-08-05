const canvasEle = document.getElementById('app') as HTMLCanvasElement;

canvasEle.width = canvasEle.clientWidth;
canvasEle.height = canvasEle.clientHeight;

const canvasWidth = canvasEle.width;
const canvasHeight = canvasEle.height;

const canvas = canvasEle.getContext('2d')!;

// 绘制一个像素点
export function putPixel(x: number, y: number, color: string) {
  const halfH = canvasEle.height / 2;
  const halfW = canvasEle.width / 2;

  if (x > halfW / 2 || y > halfH || x < -halfW || y < -halfH) {
    return;
  }

  const trueX = halfW + x;
  const trueY = halfH - y;

  canvas.fillStyle = color;
  canvas.fillRect(trueX, trueY, 1, 1);
}

const viewWidth = 100;
const viewHeight = 100;

// canvas坐标转viewport坐标
function canvas2viewport(x: number, y: number) {
  return [(x * viewWidth) / canvasWidth, (y * viewHeight) / canvasHeight, 100];
}
