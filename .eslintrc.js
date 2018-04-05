module.exports = {
	parser: 'babel-eslint',
	extends: [
		'wordpress',
	],
	plugins: [
		'react',
		'jsx-a11y',
	],
	env: { browser: true, es6: true },
	rules: {
		'import/prefer-default-export': 0,
		'react/jsx-filename-extension': 0,
	}
};