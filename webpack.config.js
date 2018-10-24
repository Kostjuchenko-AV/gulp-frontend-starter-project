module.exports = {
	mode: 'development',
	output: {
		filename: 'app.js',
	},
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.(js)$/,
				exclude: /(node_modules)/,
				loader: 'babel-loader',
				query: {
				presets: ['env']
				}
			}
		],
	},
}