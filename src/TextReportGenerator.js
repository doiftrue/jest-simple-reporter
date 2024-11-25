const { markdownTable } = require( 'markdown-table' )

const Options = require( './Options' )

module.exports = class TextReportGenerator {

	#jestResults = {}
	#readyResults = {}

	/**
	 * @param {object} jestResults
	 * @param {object} readyResults
	 *
	 * @returns {string}
	 */
	constructor( jestResults, readyResults ){
		this.#jestResults = jestResults
		this.#readyResults = readyResults
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

		text += `REPORT form  ${time}  (${this.#totalDuration()})\n\n`

		text += markdownTable( [
			[ '', '✓ Passed', '✗ Failed', '• Pending' ],
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
			const min = seconds / 60
			const sec = seconds % 60

			return `${Math.floor(min)} min ${sec.toFixed(3)} sec`
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

			text += `${indent}${this.#formatKey( key )}\n`

			if( Array.isArray( value ) ){
				for( let obj of value ){
					const duration = Options.showDuration ? ` (${obj.duration} ms)` : ''
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

	#formatKey( key ){
		let items = [
			{
				regex: /^__FPATH__ /,
				callback: Options.filterFilepathCb
			},
			{
				regex: /^__GROUP__ /,
				callback: Options.filterGroupCb
			},
			{
				regex: /^__STATUS__ /,
				callback: Options.filterStatusCb
			},
		]

		for( let item of items ){
			if( item.regex.test( key ) ){
				let str = key.replace( item.regex, '' )
				return item.callback ? item.callback( str ) : str
			}
		}

		return key
	}

	#removeColorization( str ){
		const ansiRegex = /\x1b\[[0-9;]*m/g
		return str.replace( ansiRegex, '' )
	}

}
