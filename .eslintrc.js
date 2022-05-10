module.exports = {
  root: true,
  extends: '@react-native-community',
  settings: {
    react: {
      version: '17',
    },
  },
  rules: {
    'react/no-did-mount-set-state': 0,
    'react/no-did-update-set-state': 0,
    eqeqeq: 0,
    'react-native/no-inline-styles': 0,
    'no-catch-shadow': 0,
    'no-sequences': 2,
    'handle-callback-err': 0,
    'no-useless-escape': 0,
    radix: 0,
    'no-shadow': 0,
    'no-func-assign': 0,
  },
};
