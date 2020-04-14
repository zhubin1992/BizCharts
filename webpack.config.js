const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const pagckageJSON = require('./package.json');

const env = process.env.NODE_ENV;
const isProduction = env === 'production';

/* invoke */
const packageName = 'BizCharts';

const config = {
  mode: 'production',
  entry: {
    index: ['./src/index.tsx']
  },
  output: {
    filename: isProduction? 'BizCharts.min.js' : 'BizCharts.js',
    library: packageName,
    libraryTarget: 'umd',
    path: path.resolve(__dirname, './umd')
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      utils: path.resolve(__dirname, './src/utils'),
      'bizcharts': path.resolve(__dirname, './src'),
      '@': path.resolve(__dirname, './src'),
    }
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
      umd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
      umd: 'react-dom',
    },
    // react: 'React',
    // 'react-dom': 'ReactDOM',
  },
  module: {
    rules: [{
        test: /\.s?css$/,
        use: ['style-loader', 'raw-loader', 'sass-loader'],
        include: [path.resolve(__dirname, '../css/')],
      },
      {
        test: /\.svg$/,
        use: [{
          loader: 'babel-loader',
          query: {
            presets: ['airbnb'],
          },
        }, ],
      },
      {
        test: /\.(js|jsx)$/,
        use: [{
          loader: 'babel-loader',
          query: {
            presets: [
              ["@babel/preset-env", { "targets": "last 2 versions, ie 11", "modules": false }]
            ]
          }
        }],
      },
      {
        test: /\.(ts|tsx)$/,
        use: [{
          loader: 'babel-loader',
          query: {
            presets: [
              ["@babel/preset-env", { "targets": "last 2 versions, ie 11", "modules": false }]
            ]
          }
        }, {
          loader: require.resolve('ts-loader'),
          options: {
            transpileOnly: true,
          },
        }]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: !isProduction,
      __VERSION__: pagckageJSON.version,
    })
    
  ],
  optimization: {
    minimize: isProduction,
    minimizer: [new TerserPlugin({
      extractComments: false,
      terserOptions: {
        compress: {
          drop_console: true,
        },
      }
    })],
  },
};

if (env === 'development' || env === 'production') {
  // umd do not use prop-types as external lib.
  delete config.externals['prop-types'];
}

module.exports = config;
