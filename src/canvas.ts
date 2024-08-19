import { RGB } from './interface';
import { Scene } from './components/scene';
import WebworkerPromise from 'webworker-promise';

const canvasEle = document.getElementById('c') as HTMLCanvasElement;

canvasEle.width = canvasEle.clientWidth;
canvasEle.height = canvasEle.clientHeight;

const CANVAS_WIDTH = canvasEle.width;
const CANVAS_HEIGHT = canvasEle.height;

const canvas = canvasEle.getContext('2d')!;

const CANVAS_HALF_WIDTH = CANVAS_WIDTH / 2;
const CANVAS_HALF_HEIGHT = CANVAS_HEIGHT / 2;

// 在画布上绘制一个像素点
function drawPixels(pixelColors: Uint8ClampedArray) {
  const imageData = new ImageData(CANVAS_WIDTH, CANVAS_HEIGHT);

  imageData.data.set(pixelColors);

  canvas.putImageData(imageData, 0, 0);
}

const worker = new Worker(
  new URL('./worker/render.worker.ts', import.meta.url),
);
const renderWorker = new WebworkerPromise(worker);

const chunkHeight = Math.ceil(CANVAS_HEIGHT / 4);
const chunks = [
  {
    startX: -CANVAS_HALF_WIDTH,
    startY: CANVAS_HALF_HEIGHT - chunkHeight,
    endX: CANVAS_HALF_WIDTH,
    endY: CANVAS_HALF_HEIGHT,
  },
  {
    startX: -CANVAS_HALF_WIDTH,
    startY: CANVAS_HALF_HEIGHT - 2 * chunkHeight,
    endX: CANVAS_HALF_WIDTH,
    endY: CANVAS_HALF_HEIGHT - chunkHeight - 1,
  },
  {
    startX: -CANVAS_HALF_WIDTH,
    startY: CANVAS_HALF_HEIGHT - 3 * chunkHeight,
    endX: CANVAS_HALF_WIDTH,
    endY: CANVAS_HALF_HEIGHT - 2 * chunkHeight - 1,
  },
  {
    startX: -CANVAS_HALF_WIDTH,
    startY: -CANVAS_HALF_HEIGHT,
    endX: CANVAS_HALF_WIDTH,
    endY: CANVAS_HALF_HEIGHT - 3 * chunkHeight - 1,
  },
];

export function render(scene: Scene) {
  const promises = chunks.map((chunk) => {
    return renderWorker.postMessage({
      scene,
      ...chunk,
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
    });
  });

  const pixelColors = new Uint8ClampedArray(CANVAS_WIDTH * CANVAS_HEIGHT * 4);

  Promise.all(promises).then((results) => {
    results.forEach((result: { x: number; y: number; color: RGB }[]) => {
      result.forEach(({ x, y, color }) => {
        const canvasX = x + CANVAS_HALF_WIDTH;
        const canvasY = CANVAS_HEIGHT - (y + CANVAS_HALF_HEIGHT) - 1;

        const index = (canvasY * CANVAS_WIDTH + canvasX) * 4;
        pixelColors[index] = color[0];
        pixelColors[index + 1] = color[1];
        pixelColors[index + 2] = color[2];
        pixelColors[index + 3] = 255;
      });
    });

    drawPixels(pixelColors);
  });
}