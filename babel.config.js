module.exports = (api) => {
  // Cache configuration is a required option
  api.cache(false);

  const presets = [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 4
        },
        useBuiltIns: 'usage',
        corejs: 3
      }
    ]
  ];

  return { presets };
};
