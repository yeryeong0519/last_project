const bootstrapSassAbstractsImports = require('vue-cli-plugin-bootstrap-vue/sassAbstractsImports.js');
module.exports = {
  outputDir: '../src/main/resources/static', // 빌드 타겟 디렉토리
  devServer: {
    port: 8082,
    proxy: {
      '/api': {
        // '/api' 로 들어오면 포트 8081(스프링 서버)로 보낸다
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
    },
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: bootstrapSassAbstractsImports.join('\n'),
      },
      scss: {
        additionalData: [...bootstrapSassAbstractsImports, ''].join(';\n'),
      },
    },
  },
};
