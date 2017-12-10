var path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: './client',

  output: {
    path: path.join(__dirname, 'public'),
    filename: 'app.js'
  },

  resolve: {
		extensions: ['.jsx', '.js', '.json', '.less'],
		modules: [
			path.resolve(__dirname, "node_modules"),
			'node_modules'
		],
		alias: {
			'react': 'preact-compat',
			'react-dom': 'preact-compat'
		}
	},

  module: {
    rules: [{
      test: /\.jsx?/i,
      loader: 'babel-loader',
      options: {
        presets: [
          'es2015'
        ],
        plugins: [
          ['transform-react-jsx', {
            pragma: 'h'
          }]
        ]
      }
    }]
  },

  // enable Source Maps
  devtool: 'source-map',

  plugins: [
    new UglifyJsPlugin({
      extractComments: true,
      parallel: true,
      sourceMap: true,
    }),
  ],
};
