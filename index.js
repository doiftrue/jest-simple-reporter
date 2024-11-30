const fs = require( 'fs' )
const path = require( 'path' )

const TextReportGenerator = require( './src/TextReportGenerator' )
const ResultsTransformer = require( './src/ResultsTransformer' )
const Options = require( './src/Options' )

module.exports = class jestTextReporter {

	constructor( globalConfig, options = {} ){
		new Options( options ) // init option
	}

	onRunComplete( contexts, jestResults ){
		// change original jestResults data
		Options.truncateMsg      && this.#truncateLongErrorMessages( jestResults )
		Options.relativeFilepath && this.#makeTestFilePathRelative( jestResults )

		const textReport = new TextReportGenerator( jestResults, new ResultsTransformer() ).getTextReport()

		this.#saveToFile( textReport )

		return jestResults
	}

	#saveToFile( text ){
		const filename = `${Options.outputFile}`
		const dir = path.resolve( path.dirname( filename ) )

		fs.existsSync( dir ) || fs.mkdirSync( dir )
		fs.writeFileSync( filename, text, 'utf-8' )
	}

	/**
	 * Change original messages length to other reporters use truncated.
	 * NOTE: this reporter should be first in the list of reporters in jest.config.js.
	 */
	#truncateLongErrorMessages( results ){
		results.testResults.forEach( result => {
			result.testResults.forEach( assert => {
				assert.failureMessages = assert.failureMessages.map( msg => {
					if( msg.length > Options.truncateMsg ){
						msg = msg.slice( 0, Options.truncateMsg ) + '...'
					}
					return msg
				} )
			} )
		} )
	}

	#makeTestFilePathRelative( results ){
		results.testResults.forEach( result => {
			let filePath = result.testFilePath

			filePath = filePath.replace( `${path.resolve('.')}/`, '' )

			result.testFilePath = filePath
		} )
	}

}
