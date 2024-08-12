import './index.css';
import { render } from './canvas';
import { Scene } from './components/scene';
import { Sphere } from './components/sphere';
import { AmbientLight, DirectionalLight, PointLight } from './components/light';
import Stats from 'stats.js';

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

scene.camera.rotation = {
  direction: 'y',
  radian: 0,
};

// 创建Stats实例
const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

function animate() {
  stats.begin();

  scene.camera.rotation.radian += Math.PI / 180;
  render(scene);

  stats.end();

  requestAnimationFrame(animate);
}

animate();