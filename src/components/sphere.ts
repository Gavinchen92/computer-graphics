import { Point } from '../interface';
import chroma from 'chroma-js';

export class Sphere {
  center: Point;
  radius: number;
  color: chroma.ColorSpaces['rgb'];
  /* 光泽度 */
  specular: number;
  /* 反射率 */
  reflective: number;

  constructor(options: {
    center: Point;
    radius: number;
    color: chroma.ColorSpaces['rgb'];
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
