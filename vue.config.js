import { defineConfig } from '@vue/cli-service';
import webpack from 'webpack';

export default defineConfig({
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        '__VUE_OPTIONS_API__': JSON.stringify(true),
        '__VUE_PROD_DEVTOOLS__': JSON.stringify(false),
        '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': JSON.stringify(false)
      })
    ]
  },
  chainWebpack: config => {
    
    config.module
      .rules.delete('html');

    
  }
});


