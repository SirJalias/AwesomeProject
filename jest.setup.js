/* eslint-env jest */
/**
 * Jest setup: mock native modules that aren't available in the test runtime.
 */

require('react-native-gesture-handler/jestSetup');

jest.mock('react-native-bootsplash', () => ({
  hide: jest.fn().mockResolvedValue(undefined),
  show: jest.fn().mockResolvedValue(undefined),
  isVisible: jest.fn().mockResolvedValue(false),
  useHideAnimation: jest.fn(),
}));
