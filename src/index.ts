import './index.css';
import { render } from './canvas';
import { Scene } from './components/scene';
import { Sphere } from './components/sphere';
import { AmbientLight, DirectionalLight, PointLight } from './components/light';

const scene = new Scene();

// 红色球体
scene.addSphere(
  new Sphere({
    center: [0, -1, 3],
    radius: 1,
    color: 'red',
    specular: 500,
    reflective: 0.2,
  }),
);

// 蓝色球体
scene.addSphere(
  new Sphere({
    center: [2, 0, 4],
    radius: 1,
    color: 'blue',
    specular: 500,
    reflective: 0.3,
  }),
);

// 绿色球体
scene.addSphere(
  new Sphere({
    center: [-2, 0, 4],
    radius: 1,
    color: 'green',
    specular: 10,
    reflective: 0.4,
  }),
);

// 黄色球体
scene.addSphere(
  new Sphere({
    center: [0, -5001, 0],
    radius: 5000,
    color: 'yellow',
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

render(scene);