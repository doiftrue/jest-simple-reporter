const fs = require( 'fs' )
const path = require( 'path' )

const TextReportGenerator = require( './src/TextReportGenerator' )

module.exports = class jestTextReporter {

	#options = {}
	#results = {}

	constructor( globalConfig, options = {} ){
		this.#options = {
			outputFile: './tests.txt',
			truncateMsg: 1000,
			nameRelatify: true,
			nameRelatifyRegexp: '',
			showDuration: true,
			...options
		}
	}

	onRunComplete( contexts, results ){
		this.#options.nameRelatify = !! ( this.#options.nameRelatify || this.#options.nameRelatifyRegexp )

		if( this.#options.truncateMsg ){
			this.#truncateLongErrorMessages( results )
		}

		if( this.#options.nameRelatify ){
			this.#makeTestFilePathRelative( results )
		}

		results.testResults.forEach( result => this.#collectTestsResults( result ) )

		this.#saveToFile( new TextReportGenerator( results, this.#results, this.#options ).getTextReport() )

		return results
	}

	#saveToFile( text ){
		const filename = `${this.#options.outputFile}`
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
					if( msg.length > this.#options.truncateMsg ){
						msg = msg.slice( 0, this.#options.truncateMsg ) + '...'
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

			if( this.#options.nameRelatifyRegexp ){
				filePath = filePath.replace( new RegExp( this.#options.nameRelatifyRegexp ), '' )
			}

			result.testFilePath = filePath
		} )
	}

	#collectTestsResults( result ){
		const suiteRef = this.#results[ result.testFilePath ] = {}

		result.testResults.forEach( assert => {
			let baseRef = suiteRef

			for( const groupTitle of assert.ancestorTitles ){
				if( groupTitle ){
					baseRef[this.#butifyGroupTitle(groupTitle)] ??= {}
					baseRef = baseRef[this.#butifyGroupTitle(groupTitle)]
				}
			}

			baseRef[ this.#butifyStatus( assert.status ) ] ??= []

			baseRef[ this.#butifyStatus( assert.status ) ].push( this.#assertResult( assert ) )
		} )
	}

	#assertResult( assert ){
		/*
		assert example = {
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

		switch( assert.status ){
			case 'passed':
				return { tit: `✔ ${assert.title}`, err: '', ...assert }

			case 'failed':
				return { tit: `✘ ${assert.title}`, err: assert.failureMessages.join( `\n` ), ...assert }

			case 'pending':
				return { tit: `◑ ${assert.title}`, err: '', ...assert }

			default:
				return { ...assert }
		}
	}

	#butifyGroupTitle( title ){
		return `[${title}]`
	}

	#butifyStatus( status ){
		return status.toUpperCase()
	}

}
