import { renderTemplate } from '../../src/Util/String';

import Glue from '../../src/Glue/Glue';
import GlueErrors from '../../src/Glue/GlueErrors';
import GlueModule from '../../src/Glue/GlueModule';
import GlueConfig from '../../src/Glue/GlueConfig';

class MyModule extends GlueModule {}

let glue : Glue = new Glue();
const body : Element = document.getElementsByTagName( 'body' )[ 0 ];

describe( 'Glue', () => {
    
    afterEach( () => {
        glue = new Glue();
    } );
    
    it( 'should be defined', () => {
        expect( typeof Glue ).toBe( 'function' );
    } );
    
    describe( '.registerModule()', () => {
        
        it( 'should have a method to register modules', () => {
            expect( typeof glue.registerModule ).toBe( 'function' );
        } );
        
        it( 'should not throw when 1st param is a valid module name (a string)', () => {
            expect( () => {
                glue.registerModule( MyModule );
            } ).not.toThrow();
        } );
        
        it( 'should not throw when 2nd param is a valid creator function', () => {
            expect( () => {
                glue.registerModule( MyModule );
            } ).not.toThrow();
        } );
        
        it( 'should throw when moduleName is already registered', () => {
            expect( () => {
                glue.registerModule( MyModule );
                glue.registerModule( MyModule );
            } )
            .toThrow(
                new Error( renderTemplate( GlueErrors.ALREADY_REGISTERED, { name : 'MyModule' } ) )
            );
        } );
        
    } );
    
    describe( 'getRootElement()', () => {
        
        it( 'should have a method to get the root dom node', () => {
            expect( typeof glue.getRootElement ).toBe( 'function' );
        } );
        
        it( 'should return the root element', () => {
            expect( glue.getRootElement() ).toBe( body ); // body = default
        } );
        
    } );
    
    describe( 'constructor()', () => {
        
        it( 'should throw when root dom node is not a native dom node', () => {
            
            class FailingConfig extends GlueConfig {
                ROOT_ELEMENT = document.getElementById( '404' ) as Element;
            }
            
            const config = new FailingConfig();
            
            expect( () => new Glue( config ) ).toThrow(
                new Error( GlueErrors.ROOT_ELEMENT_FAIL )
            );
        } );
        
    } );
    
    describe( 'getUnstartedDomNodes()', () => {
        it( 'should have a method to return all unstarted/uninitialized dom nodes', () => {
            expect( glue.getUnstartedDomNodes ).toBeDefined();
        } );
        
        it( 'should return all unstarted/uninitialized dom nodes', () => {
            body.innerHTML = `
                <div data-js-module="one"></div>
                <div data-js-module="two" data-js-module-id="id12345"></div>
                <div data-js-module="three"></div>
            `;
            
            expect(
                glue.getUnstartedDomNodes( body ).map( n => n.getAttribute( 'data-js-module' ) )
            ).toEqual( [ 'one', 'three' ] );
            
            body.innerHTML = `
                <div data-js-module="two" data-js-module-id="id12345"></div>
                <div data-js-module="two" data-js-module-id="id12345"></div>
                <div data-js-module="two" data-js-module-id="id12345"></div>
            `;
            
            expect(
                glue.getUnstartedDomNodes( body )
            ).toEqual( [] );
            
        } );
        
    } );
    
} );