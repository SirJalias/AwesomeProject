const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
// Pre-loads the Bundle Mode entry points into the JS bundle (worklets >= 0.10).
const { bundleModeMetroConfig } = require('react-native-worklets/bundleMode');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {};

module.exports = mergeConfig(
  getDefaultConfig(__dirname),
  bundleModeMetroConfig,
  config,
);
