import ExtractTextPlugin from 'extract-text-webpack-plugin';
import path from 'path';

import packageJson from './package.json';

const PROD = process.argv.includes( '-p' );
const min = PROD ? '.min' : '';
const entry = {
	[packageJson.name]: [
		'./src/js/index.js',
		'./src/css/style.css'
	],
	[`${packageJson.name}-editor`]: [
		'./src/editor/js/index.js',
		'./src/editor/css/style.css'
	]
};
const filename = `[name]${min}.js`;
const plugins = [ new ExtractTextPlugin( `[name]${min}.css` ) ];

const main = {
	mode: PROD ? 'production' : 'development',
	entry,
	output: {
		filename,
		path: path.resolve( __dirname, 'dist' )
	},
	plugins,
	module: {
		rules: [
			{
				test: /\.js$/,
				use: {
					loader: 'babel-loader',
					options: {
						babelrc: true
					}
				}
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						'css-loader',
						{
							loader: 'postcss-loader',
							options: {
								plugins: [ require( 'autoprefixer' ) ]
							}
						}
					]
				})
			}
		]
	},
	devtool: ( ! PROD ) && 'sourcemap'
};


export default main;
