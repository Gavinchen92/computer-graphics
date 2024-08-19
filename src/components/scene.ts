import { Camera } from './camera';
import { PointLight, AmbientLight, DirectionalLight } from './light';
import { Sphere } from './sphere';

export class Scene {
  public spheres: Sphere[] = [];
  public lights: Array<PointLight | AmbientLight | DirectionalLight> = [];
  public camera: Camera;

  constructor() {
    this.spheres = [];
    this.lights = [];
    this.camera = new Camera({ position: [0, 0, 0] });
  }

  addSphere(sphere: Sphere) {
    this.spheres.push(sphere);
  }

  addLight(light: PointLight | AmbientLight | DirectionalLight) {
    this.lights.push(light);
  }

  addCamera(camera: Camera) {
    this.camera = camera;
  }
}
