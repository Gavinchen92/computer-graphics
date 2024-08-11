import { Point } from '../interface';

export class Camera {
  position: Point;
  rotation: {
    direction: 'x' | 'y' | 'z';
    radian: number;
  };

  constructor(options: { position: Point; rotation: number }) {
    this.position = options.position;
    this.rotation = {
      direction: 'x',
      radian: 0,
    };
  }
}
