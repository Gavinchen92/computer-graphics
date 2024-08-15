import shaderCode from './shader/index.wgsl';

export async function init() {
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    console.error('WebGPU adapter not found');
    return;
  }
  const device = await adapter.requestDevice();

  if (!device) {
    console.error('WebGPU device not found');
    return;
  }

  const shaderModule = device.createShaderModule({
    code: shaderCode,
  });

  const canvas = document.getElementById('c2') as HTMLCanvasElement;

  const context = canvas.getContext('webgpu');

  if (!context) {
    console.error('WebGPU context not found');
    return;
  }

  context.configure({
    device,
    format: navigator.gpu.getPreferredCanvasFormat(),
    alphaMode: 'premultiplied',
  });

  const vertices = new Float32Array([
    0.0, 0.6, 0, 1, 1, 0, 0, 1, -0.5, -0.6, 0, 1, 0, 1, 0, 1, 0.5, -0.6, 0, 1,
    0, 0, 1, 1,
  ]);

  const vertexBuffer = device.createBuffer({
    size: vertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });

  device.queue.writeBuffer(vertexBuffer, 0, vertices, 0, vertices.length);

  const pipeLineDescriptor: GPURenderPipelineDescriptor = {
    vertex: {
      module: shaderModule,
      entryPoint: 'vertex_main',
      buffers: [
        {
          attributes: [
            {
              shaderLocation: 0, // 位置
              offset: 0,
              format: 'float32x4',
            },
            {
              shaderLocation: 1, // 颜色
              offset: 16,
              format: 'float32x4',
            },
          ],
          arrayStride: 32,
          stepMode: 'vertex',
        },
      ],
    },
    fragment: {
      module: shaderModule,
      entryPoint: 'fragment_main',
      targets: [
        {
          format: navigator.gpu.getPreferredCanvasFormat(),
        },
      ],
    },
    primitive: {
      topology: 'triangle-list',
    },
    layout: 'auto',
  };

  const pipeLine = device.createRenderPipeline(pipeLineDescriptor);

  const commandEncoder = device.createCommandEncoder();

  const clearColor = {
    r: 0,
    g: 0,
    b: 0,
    a: 1,
  };

  const passEncoder = commandEncoder.beginRenderPass({
    colorAttachments: [
      {
        view: context.getCurrentTexture().createView(),
        clearValue: clearColor,
        loadOp: 'clear',
        storeOp: 'store',
      },
    ],
  });

  passEncoder.setPipeline(pipeLine);
  passEncoder.setVertexBuffer(0, vertexBuffer);
  passEncoder.draw(3);

  passEncoder.end();
  device.queue.submit([commandEncoder.finish()]);
}
