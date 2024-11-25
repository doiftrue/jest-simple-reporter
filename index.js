const fs = require( 'fs' )
const path = require( 'path' )

const TextReportGenerator = require( './src/TextReportGenerator' )
const Options = require( './src/Options' )

module.exports = class jestTextReporter {

	#results = {}

	constructor( globalConfig, options = {} ){
		new Options( options ) // init option
	}

	onRunComplete( contexts, results ){
		Options.truncateMsg && this.#truncateLongErrorMessages( results )
		Options.relativeFilepath && this.#makeTestFilePathRelative( results )

		this.#collectTestsResults( results )

		const reportGenerator = new TextReportGenerator( results, this.#results )
		this.#saveToFile( reportGenerator.getTextReport() )

		return results
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

	#collectTestsResults( results ){
		results.testResults.forEach( result => {
			let suiteRef = this.#results[ this.#markFilePath(result.testFilePath) ] = {}
			let testRef = null

			result.testResults.forEach( test => {
				let testRef = suiteRef

				for( const groupTitle of test.ancestorTitles ){
					if( groupTitle ){
						testRef = testRef[ this.#markGroupTitle(groupTitle) ] ??= {}
					}
				}

				testRef = testRef[ this.#markStatus( test.status ) ] ??= []
				testRef.push( this.#prepareTestResult( test ) )
			} )
		} )
	}

	#markFilePath( filePath ){
		return `__FPATH__ ${filePath}`
	}

	#markGroupTitle( title ){
		return `__GROUP__ ${title}`
	}

	#markStatus( status ){
		return `__STATUS__ ${status}`
	}

	#prepareTestResult( test ){
		/*
		test = {
		  ancestorTitles: [ 'Brand: bacardi' ],
		  duration: 240,
		  failureDetails: [],
		  failureMessages: [],
		  fullName: 'Brand: bacardi Test https://www.bacardi.com/culture/angels-share/',
		  invocations: 1,
		  location: null,
		  numPassingAsserts: 756,
		  retryReasons: [],
		  status: 'passed',
		  title: 'Test https://www.bacardi.com/culture/angels-share/'
		}
		*/

		switch( test.status ){
			case 'passed':
				return { tit: `✔ ${test.title}`, err: '', ...test }

			case 'failed':
				return { tit: `✘ ${test.title}`, err: test.failureMessages.join( `\n` ), ...test }

			case 'pending':
				return { tit: `◑ ${test.title}`, err: '', ...test }

			default:
				return { ...test }
		}
	}

}
