import { RGB } from './interface';
import { Scene } from './components/scene';
import WebworkerPromise from 'webworker-promise';
import { Sphere } from './components/sphere';
import { AmbientLight, DirectionalLight, PointLight } from './components/light';
import Stats from 'stats.js';

const canvasEle = document.getElementById('c') as HTMLCanvasElement;

canvasEle.width = canvasEle.clientWidth;
canvasEle.height = canvasEle.clientHeight;

const CANVAS_WIDTH = canvasEle.width;
const CANVAS_HEIGHT = canvasEle.height;

const canvas = canvasEle.getContext('2d')!;

const CANVAS_HALF_WIDTH = CANVAS_WIDTH / 2;
const CANVAS_HALF_HEIGHT = CANVAS_HEIGHT / 2;

// 在画布上绘制像素点
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

function render(scene: Scene) {
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

const scene = new Scene();

// 红色球体
scene.addSphere(
  new Sphere({
    center: [0, -1, 3],
    radius: 1,
    color: [255, 0, 0],
    specular: 500,
    reflective: 0.2,
  }),
);

// 蓝色球体
scene.addSphere(
  new Sphere({
    center: [2, 0, 4],
    radius: 1,
    color: [0, 0, 255],
    specular: 500,
    reflective: 0.3,
  }),
);

// 绿色球体
scene.addSphere(
  new Sphere({
    center: [-2, 0, 4],
    radius: 1,
    color: [0, 255, 0],
    specular: 10,
    reflective: 0.4,
  }),
);

// 黄色球体
scene.addSphere(
  new Sphere({
    center: [0, -5001, 0],
    radius: 5000,
    color: [255, 255, 0],
    specular: 1000,
    reflective: 0.5,
  }),
);

// 环境光
scene.addLight(new AmbientLight(0.4));

// 点光源
scene.addLight(new PointLight(0.6, [2, 1, 0]));

// 平行光
scene.addLight(new DirectionalLight(0.2, [1, 4, 4]));

scene.camera.rotationX = Math.PI / 12;
scene.camera.rotationY = -Math.PI / 4;

// 创建Stats实例
const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

export function animate() {
  scene.camera.rotationY += Math.PI / 720;

  stats.begin();
  render(scene);
  stats.end();

  requestAnimationFrame(animate);
}

