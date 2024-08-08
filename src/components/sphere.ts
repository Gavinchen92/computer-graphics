import { Point } from '../interface';

export class Sphere {
  center: Point;
  radius: number;
  color: string;
  specular: number;

  constructor(center: Point, radius: number, color: string, specular: number) {
    this.center = center;
    this.radius = radius;
    this.color = color;
    this.specular = specular;
  }
}
