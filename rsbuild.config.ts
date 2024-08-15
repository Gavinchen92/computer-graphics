import { defineConfig } from '@rsbuild/core';

export default defineConfig({
  html: {
    template: './public/index.html',
  },
  tools: {
    bundlerChain: (chain) => {
      chain.module
        .rule('wgsl')
        .test(/\.wgsl$/)
        .use('raw-loader')
        .loader('raw-loader');
    },
  },
});
