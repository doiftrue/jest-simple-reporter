
module.exports = class ResultsTransformer {

	#results = {}

	constructor(){
	}

	transform( jestResults ){
		jestResults.testResults.forEach( result => {
			let suiteRef = this.#results[ this.#markFilePath(result.testFilePath) ] = {}

			result.testResults.forEach( test => {
				let testRef = suiteRef

				for( const groupTitle of test.ancestorTitles ){
					if( groupTitle ){
						testRef = testRef[ this.#markGroupTitle(groupTitle) ] ??= {}
					}
				}

				testRef = testRef[ this.#markStatus( test.status ) ] ??= []
				testRef.push( this.#transformSingleTestData( test ) )
			} )
		} )

		return this.#results
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

	#transformSingleTestData( test ){
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
