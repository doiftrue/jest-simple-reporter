const { markdownTable } = require( 'markdown-table' )


module.exports = class TextReportGenerator {

	#jestResults = {}
	#readyResults = {}
	#options = {}

	/**
	 * @param {object} jestResults
	 * @param {object} readyResults
	 * @param {object} options
	 *
	 * @returns {string}
	 */
	constructor( jestResults, readyResults, options ){
		this.#jestResults = jestResults
		this.#readyResults = readyResults
		this.#options = options
	}

	getTextReport(){
		const jestRes = this.#jestResults
		const readyRes = this.#readyResults

		let text = ''

		const options = {
			day   : '2-digit',
			month : 'short',
			year  : 'numeric',
			hour  : '2-digit',
			minute: '2-digit',
			hour12: false
		};
		const time = new Date().toLocaleString( 'en-GB', options )

		text += `REPORT form ${time}\n\n`

		text += markdownTable( [
			[ this.#totalDuration(), '✓ Passed', '✗ Failed', '• Pending' ],
			[
				`Suites (${jestRes.numTotalTestSuites})`,
				jestRes.numPassedTestSuites,
				jestRes.numFailedTestSuites,
				jestRes.numPendingTestSuites
			],
			[
				`Tests (${jestRes.numTotalTests})`,
				jestRes.numPassedTests,
				jestRes.numFailedTests,
				jestRes.numFailedTests
			]
		] )

		text += this.#prettyPrint( readyRes )

		return text.replaceAll( `\n`, `\r\n` )
	}

	/** @returns {string} */
	#totalDuration(){
		const jestRes = this.#jestResults
		const seconds = (new Date().getTime() - jestRes.startTime) / 1000

		if( seconds > 60 ){
			const minutes = Math.floor( seconds / 60 )
			const remainingSeconds = seconds % 60

			return `${minutes} min ${remainingSeconds} sec`
		}
		else {
			return `${seconds.toFixed( 3 )} sec`
		}
	}

	#prettyPrint( data, indentNum = 0 ){
		const spaces = '  '
		let indent = spaces.repeat( indentNum )
		let text = ''

		for( const [ key, value ] of Object.entries( data ) ){
			if( 0 === indentNum ){
				text += `\n\n\n`
			}
			if( 1 === indentNum ){
				text += `\n`
			}

			text += `${indent}${key}\n`

			if( Array.isArray( value ) ){
				for( let obj of value ){
					const duration = this.#options.showDuration ? ` (${obj.duration} ms)` : ''
					text += `${indent}${spaces}${obj.tit} ${duration}\n`

					if( obj.err ){
						let errorMsg = obj.err.replaceAll( /^|\n/g, `$&${indent}${spaces}${spaces}` )
						text += this.#removeColorization( `${errorMsg}\n\n` )
					}
				}

				continue
			}

			if( 'object' === typeof value ){
				text += this.#prettyPrint( value, indentNum + 1 ) // recursion

				continue
			}

			throw Error( 'Wrong data passed to #prettyPrint() method' )
		}

		return text
	}

	#removeColorization( str ){
		const ansiRegex = /\x1b\[[0-9;]*m/g
		return str.replace( ansiRegex, '' )
	}

}
