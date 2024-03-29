module.exports = {
  presets: [
      "@babel/env",
      '@babel/preset-react',
      '@babel/preset-typescript',
  ],
  plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-transform-modules-commonjs',
      'babel-plugin-dynamic-import-node',
      "transform-class-properties",
  ],
};