import { Point } from '../interface';

export class Sphere {
  center: Point;
  radius: number;
  color: string;
  /* 光泽度 */
  specular: number;
  /* 反射率 */
  reflective: number;

  constructor(options: {
    center: Point;
    radius: number;
    color: string;
    specular: number;
    reflective: number;
  }) {
    this.center = options.center;
    this.radius = options.radius;
    this.color = options.color;
    this.specular = options.specular;
    this.reflective = options.reflective;
  }
}
