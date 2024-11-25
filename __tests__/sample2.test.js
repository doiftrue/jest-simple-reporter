
test( 'this test should fail', () => {
	const value = 10
	expect( value ).toBe( 5 )
} )

test( 'async test example', async() => {
	const fetchData = () => Promise.resolve( 'data' )
	const data = await fetchData()
	expect( data ).toBe( 'data' )
} )


describe( 'describe group level 1', () => {
	let value

	beforeAll( () => value = 42 )
	beforeEach( () => value += 1 )
	afterEach( () => value -= 1 )
	afterAll( () => value = null )

	test( 'Test: value after beforeEach', () => {
		expect( value ).toBe( 43 )
	} )

	test( 'Test: value resets after afterEach', () => {
		expect( value ).toBe( 43 )
	} )
} )
