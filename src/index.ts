import './index.css';
import { render } from './canvas';
import { Scene } from './components/scene';
import { Sphere } from './components/sphere';
import { AmbientLight, DirectionalLight, PointLight } from './components/light';

const scene = new Scene();
scene.addSphere(new Sphere([0, -1, 3], 1, 'red', 500));
scene.addSphere(new Sphere([2, 0, 4], 1, 'green', 500));
scene.addSphere(new Sphere([-2, 0, 4], 1, 'blue', 10));
scene.addSphere(new Sphere([0, -5001, 0], 5000, 'yellow', 1000));
scene.addLight(new AmbientLight(0.2));
scene.addLight(new PointLight(0.6, [2, 1, 0]));
scene.addLight(new DirectionalLight(0.2, [0, 4, 4]));

render(scene);