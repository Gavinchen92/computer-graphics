import { RGB } from './interface';
import { Scene } from './components/scene';
import { Point } from './interface';
import WebworkerPromise from 'webworker-promise';

const canvasEle = document.getElementById('c') as HTMLCanvasElement;

canvasEle.width = canvasEle.clientWidth;
canvasEle.height = canvasEle.clientHeight;

const CANVAS_WIDTH = canvasEle.width;
const CANVAS_HEIGHT = canvasEle.height;

const canvas = canvasEle.getContext('2d')!;

const CANVAS_HALF_WIDTH = CANVAS_WIDTH / 2;
const CANVAS_HALF_HEIGHT = CANVAS_HEIGHT / 2;

const plantD = 1;
const viewportWidth = 1;
const viewportHeight = 1;

// 在画布上绘制一个像素点
function putPixel(x: number, y: number, color: RGB) {
  if (
    x > CANVAS_HALF_WIDTH ||
    y > CANVAS_HALF_HEIGHT ||
    x < -CANVAS_HALF_WIDTH ||
    y < -CANVAS_HALF_HEIGHT
  ) {
    return;
  }

  const trueX = CANVAS_HALF_WIDTH + x;
  const trueY = CANVAS_HALF_HEIGHT - y;

  canvas.fillStyle = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
  canvas.fillRect(trueX, trueY, 1, 1);
}

// canvas坐标转viewport坐标
function canvas2viewport(x: number, y: number): Point {
  return [
    (x * viewportWidth) / CANVAS_WIDTH,
    (y * viewportHeight) / CANVAS_HEIGHT,
    plantD,
  ];
}

const worker = new Worker(
  new URL('./worker/render.worker.ts', import.meta.url),
);
const renderWorker = new WebworkerPromise(worker);

const chunks = [
  // 左上
  {
    startX: -CANVAS_HALF_WIDTH,
    startY: 0,
    endX: 0,
    endY: CANVAS_HALF_HEIGHT,
  },
  // 左下
  {
    startX: -CANVAS_HALF_WIDTH,
    startY: -CANVAS_HALF_HEIGHT,
    endX: 0,
    endY: -1,
  },
  // 右上
  {
    startX: 1,
    startY: 0,
    endX: CANVAS_HALF_WIDTH,
    endY: CANVAS_HALF_HEIGHT,
  },
  // 右下
  {
    startX: 1,
    startY: -CANVAS_HALF_HEIGHT,
    endX: CANVAS_HALF_WIDTH,
    endY: -1,
  },
];

console.log(chunks);

export function render(scene: Scene) {
  const promises = chunks.map((chunk) => {
    const viewportPoint = canvas2viewport(chunk.startX, chunk.startY);
    return renderWorker.postMessage({ scene, ...chunk, viewportPoint });
  });

  Promise.all(promises).then((results) => {
    results.flat().forEach(({ x, y, color }) => {
      putPixel(x, y, color);
    });
  });
}
