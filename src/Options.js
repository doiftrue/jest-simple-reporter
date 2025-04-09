
class Options {

	outputFile = './tests.txt'
	truncateMsg = 1000
	showDuration = true

	relativeFilepath = true

	filterFilepathCb = null // Eg: str => str.replace( 'foo/bar/', '' )
	filterGroupCb = null // Eg: str => `[ ${str} ]`
	filterStatusCb = str => str.toUpperCase()
	filterAssertCb = null // Eg: assert => assert.status = 'OK'
	filterErrorMsgCb = null // Eg: str => `Some prefix: ${str}`

	static instance = null

	constructor( options ) {
		for( const opt in options ){
			this.hasOwnProperty( opt ) && ( this[opt] = options[opt] )
		}
	}

}

/**
 * This Proxy is used to make singleton from Options class and to make
 * it accessible from any module by simply importing this file.
 */
module.exports = new Proxy( Options, {

	construct( target, args ){
		target.instance || ( target.instance = new target( ...args ) )

		return target.instance
	},

	get( target, prop ){
		if( 'instance' === prop ){
			return target.instance
		}

		return target.instance[prop]
	}

} )
