import { Point } from '../interface';

export class Camera {
  position: Point;
  rotationX: number;
  rotationY: number;
  rotationZ: number;

  constructor(options: {
    position: Point;
    rotationX?: number;
    rotationY?: number;
    rotationZ?: number;
  }) {
    this.position = options.position;
    this.rotationX = options.rotationX || 0;
    this.rotationY = options.rotationY || 0;
    this.rotationZ = options.rotationZ || 0;
  }
}
