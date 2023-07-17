const tsConfig = require('./tsconfig.json');
const tsConfigPaths = require('tsconfig-paths');

let { baseUrl, paths } = tsConfig.compilerOptions;

tsConfigPaths.register({
  baseUrl,
  paths: {
    '@/*': ['./dist/*'],
  },
});
