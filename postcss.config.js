module.exports = {
	plugins: [
		require('postcss-preset-env')({
			stage: 1,
		}),
		require('postcss-import'),
		require('autoprefixer'),
		require('postcss-simple-vars'),
		require('postcss-color-functional-notation'),
	],
};
