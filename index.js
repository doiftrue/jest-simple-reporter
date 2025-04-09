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
		jestResults.testResults.forEach( result => this.#filterResult( result ) )

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

	#filterResult( result ){
		Options.relativeFilepath && this.#makeTestFilePathRelative( result )

		result.testResults.forEach( assert => {
			if( Options.filterAssertCb ){
				Options.filterAssertCb( assert )
			}

			if( Options.filterErrorMsgCb ){
				assert.failureMessages = assert.failureMessages.map( msg => Options.filterErrorMsgCb( msg ) )
			}

			if( Options.truncateMsg ){
				assert.failureMessages = assert.failureMessages.map( msg => this.#truncateLongErrorMsg( msg ) )
			}
		} )
	}

	/**
	 * Change original messages length to other reporters use truncated.
	 * NOTE: this reporter should be first in the list of reporters in jest.config.js.
	 */
	#truncateLongErrorMsg( msg ){
		if( msg.length > Options.truncateMsg ){
			msg = msg.slice( 0, Options.truncateMsg ) + '...'
		}

		return msg
	}

	#makeTestFilePathRelative( result ){
		result.testFilePath = result.testFilePath.replace( `${path.resolve('.')}/`, '' )
	}

}
