import '@testing-library/jest-native/extend-expect';

jest.mock('@shopify/react-native-skia', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockView = ({ children }: { children?: React.ReactNode }) => React.createElement(View, null, children);

  return {
    Canvas: MockView,
    Circle: MockView,
    Group: MockView,
    LinearGradient: MockView,
    RadialGradient: MockView,
    Rect: MockView,
    vec: (x: number, y: number) => ({ x, y }),
  };
});
