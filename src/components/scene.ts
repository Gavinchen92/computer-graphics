import { PointLight, AmbientLight, DirectionalLight } from './light';
import { Sphere } from './sphere';

export class Scene {
  private spheres: Sphere[] = [];
  private lights: Array<PointLight | AmbientLight | DirectionalLight> = [];

  constructor() {
    this.spheres = [];
    this.lights = [];
  }

  addSphere(sphere: Sphere) {
    this.spheres.push(sphere);
  }

  addLight(light: PointLight | AmbientLight | DirectionalLight) {
    this.lights.push(light);
  }
}
