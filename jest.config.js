/**
 * https://jestjs.io/ru/docs/configuration
 * $ npx jest --showConfig
 */

/** @type {import('jest').Config} */
module.exports = {
	verbose: true,
	coverageDirectory: 'tmp/coverage',
	reporters: [
		'default',
		[ '<rootDir>/index.js', {
			outputFile: 'tmp/report/tests-report.txt',
			truncateMsg: 1000,
			nameRelatifyRegexp: '__tests__\/',
			showDuration: true,
		} ],
	],
}
