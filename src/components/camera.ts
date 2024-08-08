import { Point } from '../interface';

export class Camera {
  position: Point;
  rotation: number; // in radians, range: -π to +π

  constructor(options: { position: Point; rotation: number }) {
    this.position = options.position;
    this.rotation = options.rotation || 0;
  }
}
