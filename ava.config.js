module.exports = {
  verbose: true,
  workerThreads: false,
  environmentVariables: {
    NODE_ENV: 'test',
    LOG_LEVEL: 'fatal',
  },
  files: ['src/**/*.test.ts'],
  typescript: {
    compile: 'tsc',
    rewritePaths: {
      'src/': 'dist/',
    },
  },
};
