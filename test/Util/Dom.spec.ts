import { createUniqueId, isDomElement } from "../../src/Util/Dom";

const body : Element = document.getElementsByTagName( 'body' )[ 0 ];

beforeEach( () => {
    body.innerHTML = `
                <div id="domElement"></div>
                <div class="moreDomElements"></div>
                <div class="moreDomElements"></div>
                <div class="moreDomElements"></div>
                <div class="moreDomElements"></div>
            `;
} );

afterEach( () => {
    body.innerHTML = '';
} );

describe( 'Util/Dom', () => {
    
    describe( 'isDomElement()', () => {
        
        it( 'should be defined', () => {
            expect( typeof isDomElement ).toBe( 'function' );
        } );
        
        it( 'should return true if param is a native Dom Element', () => {
            let domElement = document.getElementById( 'domElement' );
            expect( isDomElement( domElement ) ).toBe( true );
        } );
        
        it( 'should return false if param is not a native Dom Element', () => {
            let notFound = document.getElementById( '404' );
            expect( isDomElement( notFound ) ).toBe( false );
            expect( isDomElement( '' ) ).toBe( false );
            expect( isDomElement( null ) ).toBe( false );
            expect( isDomElement( {} ) ).toBe( false );
            expect( isDomElement( 1 ) ).toBe( false );
        } );
        
        it( 'should return false when a collection gets passed in', () => {
            let collection       = body.querySelectorAll( '.moreDomElements' );
            let collectionSingle = body.querySelector( '.moreDomElements' );
            expect( isDomElement( collection ) ).toBe( false );
            expect( isDomElement( Array.from( collection )[ 0 ] ) ).toBe( true );
            expect( isDomElement( collectionSingle ) ).toBe( true );
        } );
        
        it( 'should return false when a multiple elements gets passed in', () => {
            let multipleElements = document.getElementsByClassName( 'moreDomElements' );
            expect( isDomElement( multipleElements ) ).toBe( false );
            expect( isDomElement( multipleElements[ 0 ] ) ).toBe( true );
        } );
        
    } );
    
    describe( 'createUniqueId()', () => {
        
        it( 'should be defined', () => {
            expect( typeof createUniqueId ).toBe( 'function' );
        } );
        
        it( 'should return an id', () => {
            expect( createUniqueId() ).toBeTruthy();
        } );
        
        it( 'should return an id with prefix and suffix', () => {
            const prefix = 'pre_';
            const suffix = '_suffix';
            const id     = createUniqueId( prefix, suffix );
            expect( id ).toContain( prefix );
            expect( id ).toContain( suffix );
        } );
        
    } );
} );