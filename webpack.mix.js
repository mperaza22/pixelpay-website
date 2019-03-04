let mix = require('laravel-mix');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */


mix.styles([
	'resources/assets/vendor/docs/bootstrap.css',
	'resources/assets/vendor/mdi/css/materialdesignicons.css',
	'resources/assets/vendor/docs/styles.css',
	'resources/assets/vendor/docs/prism.css',
	'resources/assets/vendor/docs/ekko-lightbox.css',
	'resources/assets/vendor/docs/oc.css',
	'resources/assets/css/register.css'
], 'public/css/documentation.css');

mix.styles([
	'resources/assets/vendor/frontend/css/stack-interface.css',
	'resources/assets/vendor/frontend/css/socicon.css',
	'resources/assets/vendor/frontend/css/iconsmind.css',
	'resources/assets/vendor/frontend/css/bootstrap.css',
	'resources/assets/vendor/frontend/css/flickity.css',
	'resources/assets/vendor/frontend/css/theme.css',
	// 'resources/assets/css/snackbar.css',
	// 'resources/assets/css/pay.css',
	// 'resources/assets/css/frontend.css',
], 'public/css/frontend.css');

mix.scripts([
	'resources/assets/vendor/frontend/js/jquery-3.1.1.min.js',
	'resources/assets/vendor/frontend/js/flickity.min.js',
	'resources/assets/vendor/frontend/js/parallax.js',
	'resources/assets/vendor/frontend/js/granim.min.js',
	'resources/assets/vendor/frontend/js/smooth-scroll.min.js',
	'resources/assets/js/card-js.min.js',
	'resources/assets/js/nprogress.js',
	'resources/assets/js/snackbar.js',
	'resources/assets/js/money.js',
	'resources/assets/vendor/frontend/js/scripts.js',
	'resources/assets/js/frontend.js'
], 'public/js/frontend.js');

mix.scripts([
	'resources/assets/vendor/docs/prism.js',
	'resources/assets/vendor/docs/jquery.scrollTo.js',
	'resources/assets/vendor/docs/stickyfill.js',
	'resources/assets/vendor/docs/ekko-lightbox.js',
	'resources/assets/js/mask.js',
	'resources/assets/vendor/docs/main.js',
], 'public/js/documentation.js');


mix.options({
	processCssUrls: false,
	uglify: {
		uglifyOptions: {
			compress: {
				drop_console: false,
			}
		}
	},
});

mix.webpackConfig({
	module: {
		rules: [
			{ test: /\.coffee$/, loader: 'coffee-loader' }
		]
	},
	plugins: [
		new WebpackShellPlugin({
			onBuildStart:['php artisan lang:js -c --quiet'], onBuildEnd:[]
		}),
		new BrowserSyncPlugin({
			files: [
				'app/**/*',
				'public/**/*',
				'resources/views/**/*',
				'resources/lang/**/*',
				'routes/**/*',
				'docs/**/*'
			],
			notify: {
				styles:  [
					"display: none",
					"padding: 15px",
					"font-family: sans-serif",
					"position: fixed",
					"font-size: 0.9em",
					"z-index: 9999",
					"bottom: 2px",
					"right: 2px",
					"border-bottom-left-radius: 5px",
					"background-color: #1B2032",
					"margin: 0",
					"color: white",
					"text-align: center",
					"border-radius: 3px"
				]
			}
		}),
		// new CompressionPlugin({
		// 	asset: "[path].gz[query]",
		// 	algorithm: "gzip",
		// 	test: /\.js$|\.css$|\.html$|\.svg$/,
		// 	threshold: 10240,
		// 	minRatio: 0.8
		// })
	]
});