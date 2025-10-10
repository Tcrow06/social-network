/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./index.html',
		'./src/**/*.{ts,tsx,js,jsx}',
	],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				sidebar: '#36ACC1'
			},
		},
	},
	plugins: [
		require('@tailwindcss/forms'),
		require('tailwindcss-animate'),
	],
}
