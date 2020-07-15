module.exports = function(api) {
  api.cache(true);

  const presets = [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: {
          version: 3,
          proposals: true
        },
        targets: {
          browsers: ['> 1%', 'last 2 versions', 'not ie<= 8']
        }
      }
    ]
  ];
  const plugins = [['@babel/plugin-transform-runtime', { corejs: 3 }]];
  return {
    presets,
    plugins
  };
};
