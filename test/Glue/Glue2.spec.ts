import { renderTemplate } from '../../src/Util/String';

import Glue from '../../src/Glue/Glue';
import GlueErrors from '../../src/Glue/GlueErrors';
import GlueWarnings from '../../src/Glue/GlueWarnings';
import GlueModule from '../../src/Glue/GlueModule';
import GlueConfig from '../../src/Glue/GlueConfig';

import { DummyMarkup } from './Mocks/DummyMarkup';
import StartFailModule from './Mocks/StartFailModule';
import { DummyError } from './Mocks/DummyError';

class MyModule extends GlueModule {
    get name() { return 'MyModule'; }
}

let glue : Glue = new Glue();
const body : Element = document.getElementsByTagName( 'body' )[ 0 ];

describe( 'Glue', () => {
    
    afterEach( () => {
        glue = new Glue();
    } );
    
    it( 'should be defined', () => {
        expect( typeof Glue ).toBe( 'function' );
    } );
    
    describe( 'registerModule()', () => {
        
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
    
    describe( 'registerLazyModule()', () => {
        
        it( 'should have a method to register lazy modules', () => {
            expect( typeof glue.registerLazyModule ).toBe( 'function' );
        } );
        
        it( 'should start lazy modules like non-lazy modules', async () => {
            
            glue.registerLazyModule( 'DummyModule', () => import('./Mocks/DummyModule') );
            
            body.innerHTML = `<div id="DummyModule" data-js-module="DummyModule"></div>`;
            
            const el = document.getElementById( 'DummyModule' );
            
            await glue.start();
            
            expect( el.innerHTML ).toEqual( DummyMarkup );
            
        } );
        
        it( 'should throw when loaded file has no default export', async () => {
            
            glue.registerLazyModule( 'DefectiveModule', () => import('./Mocks/DefectiveModule') );
            
            body.innerHTML = `<div id="DefectiveModule" data-js-module="DefectiveModule"></div>`;
            
            try {
                await glue.start();
            } catch ( err ) {
                expect( err.message ).toEqual( GlueErrors.LAZY_IMPORT_HAS_NO_DEFAULT );
                return;
            }
            
            throw new Error( 'Promise should not be resolved' );
            
        } );
        
        it( 'should throw when module is not a function', async () => {
            
            glue.registerLazyModule( 'NotFunctionModule', () => import('./Mocks/NotFunctionModule') );
            body.innerHTML = `<div id="el" data-js-module="NotFunctionModule"></div>`;
            
            try {
                await glue.start();
            } catch ( err ) {
                expect( err.message ).toEqual( GlueErrors.NOT_A_GLUE_MODULE );
                return;
            }
            
            throw new Error( 'Promise should not be resolved' );
        } );
        
        it( 'should throw when module is not instance of GlueModule', async () => {
            
            glue.registerLazyModule( 'WrongInstanceModule', () => import('./Mocks/WrongInstanceModule') );
            body.innerHTML = `<div id="el" data-js-module="WrongInstanceModule"></div>`;
            
            try {
                await glue.start();
            } catch ( err ) {
                expect( err.message ).toEqual( GlueErrors.NOT_A_GLUE_MODULE );
                return;
            }
            
            throw new Error( 'Promise should not be resolved' );
        } );
        
    } );
    
    describe( 'start()', () => {
        
        it( 'should warn when there are unregistered modules in dom', async () => {
            
            spyOn( console, 'warn' );
            
            body.innerHTML = `
                <div data-js-module="notHere"></div>
                <div data-js-module="404"></div>
                <div data-js-module="youDontKowMe"></div>
            `;
            
            await glue.start();
            
            expect( console.warn ).toHaveBeenCalledTimes( 3 );
        } );
        
        it( 'should warn when there are unregistered modules in dom with module name', async () => {
            
            spyOn( console, 'warn' );
            
            const moduleName = 'Dummy';
            const warning    = renderTemplate( GlueWarnings.START_MODULE_NOT_REGISTERED, { name : moduleName } );
            body.innerHTML   = `<div id="el" data-js-module="${moduleName}"></div>`;
            const el         = document.getElementById( 'el' );
            
            await glue.start();
            
            expect( console.warn ).toHaveBeenCalledWith( warning, el );
        } );
        
        it( 'should throw when module start fails', async () => {
            
            spyOn( console, 'warn' );
            
            glue.registerModule( StartFailModule );
            
            const moduleName = 'StartFailModule';
            const warning    = renderTemplate( GlueWarnings.START_FAILED, { name : moduleName } );
            body.innerHTML   = `<div id="el" data-js-module="${moduleName}"></div>`;
            
            await glue.start();
            
            expect( console.warn ).toHaveBeenCalledWith( warning, DummyError );
       
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