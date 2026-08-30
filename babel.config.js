module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Reanimated plugin en sonda olmalidir.
      'react-native-reanimated/plugin',
    ],
  };
};
