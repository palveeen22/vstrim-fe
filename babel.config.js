// babel.config.js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          // FSD layer aliases
          '@app': './src/app',
          '@pages': './src/pages',
          '@widgets': './src/widgets',
          '@features': './src/features',
          '@entities': './src/entities',
          '@shared': './src/shared',
          // Asset alias
          '@assets': './src/assets',
          // Legacy (kept for backward compat during migration)
          '@src': './src',
        },
        extensions: [
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
          '.json'
        ],
      },
    ],
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
      },
    ],
    // Penting: reanimated biasanya *harus* paling terakhir jika kamu pakai
    // 'react-native-reanimated/plugin',
  ],
};
