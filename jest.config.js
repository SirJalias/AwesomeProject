module.exports = {
  preset: 'react-native',
  setupFiles: ['./jest.setup.js'],
  resolver: '<rootDir>/node_modules/react-native-worklets/jest/resolver.js',
  transformIgnorePatterns: [
    'node_modules/(?!(' +
      '@react-native|react-native|@react-navigation|' +
      'react-native-reanimated|react-native-worklets|' +
      'react-native-gesture-handler|react-native-screens|' +
      'react-native-safe-area-context|react-native-bootsplash|' +
      '@shopify/flash-list' +
      ')/)',
  ],
};
