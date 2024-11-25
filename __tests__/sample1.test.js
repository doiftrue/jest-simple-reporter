
test( 'adds 1 + 2 to equal 3', () => {
	const sum = 1 + 2
	expect( sum ).toBe( 3 )
} )


describe( 'Group (level 1)', () => {
	test( 'multiplication works', () => {
		const product = 2 * 3
		expect( product ).toBe( 6 )
	} )

	test( 'division works', () => {
		const quotient = 6 / 2
		expect( quotient ).toBe( 3 )
	} )
} )


describe( 'Group two (level 1)', () => {
	describe( 'Group level 2', () => {
		test( 'joins two strings', () => {
			const result = 'Hello' + ' ' + 'World'
			expect( result ).toBe( 'Hello World' )
		} )
	} )

	describe( 'Group level 2', () => {
		test( 'calculates string length', () => {
			const result = 'Hello'.length
			expect( result ).toBe( 5 )
		} )
	} )
} )


