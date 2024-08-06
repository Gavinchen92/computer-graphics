import { Point } from '../interface';

export class Sphere {
  center: Point;
  radius: number;
  color: string;

  constructor(center: Point, radius: number, color: string) {
    this.center = center;
    this.radius = radius;
    this.color = color;
  }
}
