import { isNonEmptyString, isFunction } from "../../src/Util/Validation";

let mock = {
    invalidStrings        : [
        null, 3, 1.23, function () {
        }, [], {}, '', document.getElementById( '404' )
    ],
    invalidFunctions      : [ 'notAFunction', null, 3, 1.23, [], {} ],
    invalidNativeDomNodes : [
        'noDomNode',
        null,
        3,
        1.23,
        [],
        {},
        document.getElementById( '404' )
    ]
};

describe( 'Util/Validation', () => {
    
    describe( 'isFunction()', () => {
        
        it( 'should be defined', () => {
            expect( typeof isFunction ).toBe( 'function' );
        } );
        
        it( 'should return false when param is not a function', () =>
            mock.invalidFunctions.forEach(
                param =>
                    expect( isFunction( param ) ).toBe( false )
            )
        );
        
        it( 'should return true when param is a function', () =>
            expect( isFunction( function () {
            } ) ).toBe( true )
        );
        
    } );
    
    describe( 'isNonEmptyString()', () => {
        
        it( 'should be defined', () => {
            expect( typeof isNonEmptyString ).toBe( 'function' );
        } );
        
        it( 'should return false when param is not a non-empty string', () =>
            mock.invalidStrings.forEach(
                param =>
                    expect( isNonEmptyString( param ) ).toBe( false )
            )
        );
        
        it( 'should return true when param is non-empty string', () =>
            expect( isNonEmptyString( 'yay' ) ).toBe( true )
        );
        
    } );
    
} );