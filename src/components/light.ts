import { Point, Vector } from '../interface';

export type LightType = 'point' | 'directional' | 'ambient';

export class AmbientLight {
  type = 'ambient';

  constructor(public intensity: number) {
    this.intensity = intensity;
  }
}

export class PointLight {
  type = 'point';

  constructor(
    public intensity: number,
    public position: Point,
  ) {
    this.intensity = intensity;
    this.position = position;
  }
}

export class DirectionalLight {
  type = 'directional';

  constructor(
    public intensity: number,
    public direction: Vector,
  ) {
    this.intensity = intensity;
    this.direction = direction;
  }
}
