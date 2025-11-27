// babel.config.js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@assets': './src/assets',
          '@app': './src/app',
          '@components': './src/components',
          '@domain': './src/domain',
          '@routes': './src/routes',
          '@screen': './src/screen',
          '@utility': './src/utility',
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
