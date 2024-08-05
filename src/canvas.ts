export class Canvas {
  canvas: CanvasRenderingContext2D;
  canvasEle: HTMLCanvasElement;

  constructor() {
    const canvasEle = document.getElementById('app') as HTMLCanvasElement;

    canvasEle.width = canvasEle.clientWidth;
    canvasEle.height = canvasEle.clientHeight;

    this.canvas = canvasEle.getContext('2d')!;
    this.canvasEle = canvasEle;
  }

  putPixel(x: number, y: number, color: string) {
    const halfW = this.canvasEle.width / 2;
    const halfH = this.canvasEle.height / 2;

    if (x > this.canvasEle.width / 2 || y > this.canvasEle.height / 2) {
      return;
    }

    this.canvas.fillStyle = color;
    this.canvas.fillRect(x, y, 1, 1);
  }
}

const c = new Canvas();
