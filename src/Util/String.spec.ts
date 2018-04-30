import { renderTemplate, replaceAll } from "../Util/String";

describe( 'Util/String', () => {
    
    describe( 'replaceAll()', () => {
        
        it( 'should be defined', () => expect( typeof replaceAll ).toBe( 'function' ) );
        
        it( 'should replace all occurances of a string in another string', () =>
            expect( replaceAll( 'Werner', 'Hans', 'Hallo Werner.' ) ).toBe( 'Hallo Hans.' )
        );
        
    } );
    
    describe( 'renderTemplate()', () => {
        
        it( 'should be defined', () => expect( typeof renderTemplate ).toBe( 'function' ) );
        
        it( 'should replace all occurances of placeholders in another string', () => {
            const template = "Hallo {firstName} {lastName}. You are {firstName}!";
            const vars     = {
                firstName : 'Hans',
                lastName  : 'Schmidt',
                notUsed   : '404'
            };
            const result   = 'Hallo Hans Schmidt. You are Hans!';
            expect( renderTemplate( template, vars ) ).toBe( result );
        } );
        
        it( 'should work with custom pre and suffixes', () => {
            const template = "Hallo [firstName] [lastName]. You are [firstName]!";
            const vars     = {
                firstName : 'Hans',
                lastName  : 'Schmidt',
                notUsed   : '404'
            };
            const result   = 'Hallo Hans Schmidt. You are Hans!';
            expect( renderTemplate( template, vars, '[', ']' ) ).toBe( result );
        } );
        
    } );
    
} );