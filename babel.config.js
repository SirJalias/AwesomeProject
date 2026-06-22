// Bundle Mode (worklets >= 0.10) bundles worklets into the JS bundle instead of
// serializing them inline. strictGlobal is recommended alongside it.
const workletsPluginOptions = {
  bundleMode: true,
  strictGlobal: true,
};

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  // react-native-worklets/plugin powers Reanimated 4 worklets and MUST be last.
  plugins: [['react-native-worklets/plugin', workletsPluginOptions]],
};
