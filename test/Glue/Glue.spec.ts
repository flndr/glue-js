import { renderTemplate } from '../../src/Util/String';

import Glue         from '../../src/Glue/Glue';
import GlueErrors   from '../../src/Glue/GlueErrors';
import GlueWarnings from '../../src/Glue/GlueWarnings';
import GlueModule   from '../../src/Glue/GlueModule';
import GlueConfig   from '../../src/Glue/GlueConfig';

import { DummyMarkup } from './Mocks/DummyMarkup';
import StartFailModule from './Mocks/StartFailModule';
import StopFailModule  from './Mocks/StopFailModule';
import { DummyError }  from './Mocks/DummyError';

class MyModule extends GlueModule {
}

let glue : Glue      = new Glue();
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
                glue.registerModule( 'MyModule', MyModule );
            } ).not.toThrow();
        } );
        
        it( 'should throw when 1st param is an invalid module name', () => {
            expect( () => {
                glue.registerModule( '', MyModule );
            } ).toThrow();
            expect( () => {
                glue.registerModule( null, MyModule );
            } ).toThrow();
        } );
        
        it( 'should not throw when 2nd param is a valid module', () => {
            expect( () => {
                glue.registerModule( 'MyModule', MyModule );
            } ).not.toThrow();
        } );
        
        it( 'should throw when 2nd param is an invalid module', () => {
            expect( () => {
                glue.registerModule( 'Invalid', null );
            } ).toThrow();
        } );
        
        it( 'should throw when moduleName is already registered', () => {
            expect( () => {
                glue.registerModule( 'MyModule', MyModule );
                glue.registerModule( 'MyModule', MyModule );
            } )
            .toThrow(
                new Error( renderTemplate( GlueErrors.ALREADY_REGISTERED, { name : 'MyModule' } ) )
            );
        } );
        
        it( 'should warn when lazy moduleName is already registered', async () => {
            
            spyOn( console, 'warn' );
    
            body.innerHTML = `<div data-js-module="LazyDouble"></div>`;
            
            expect( () => {
                glue.registerModule( 'LazyDouble', MyModule );
                glue.registerLazyModule( 'LazyDouble', () => import('./Mocks/DummyModule') );
            } ).not.toThrow();
            
            try {
                await glue.start();
            } catch ( err ) {
                throw new Error( 'Should not throw!' );
            }
            
            expect( console.warn ).toHaveBeenCalledTimes( 2 ); // 1x lazy double, 1x glue start failed
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
        
        class MyFirstModule extends GlueModule {
            async render() {
                return 'MyFirstModule';
            }
        }
        
        class MySecondModule extends GlueModule {
            async render() {
                return 'MySecondModule';
            }
        }
        
        class MyThirdModule extends GlueModule {
            async render() {
                return 'MyThirdModule';
            }
        }
        
        it( 'should start all modules in root dom node by default', async () => {
            
            glue.registerModule( 'MyFirstModule', MyFirstModule );
            glue.registerModule( 'MySecondModule', MySecondModule );
            glue.registerModule( 'MyThirdModule', MyThirdModule );
            
            body.innerHTML = `
                <div id="first" data-js-module="MyFirstModule"></div>
                <div id="second" data-js-module="MySecondModule"></div>
                <div id="third" data-js-module="MyThirdModule"></div>
            `;
            
            await glue.start();
            
            const first  = document.getElementById( 'first' );
            const second = document.getElementById( 'second' );
            const third  = document.getElementById( 'third' );
            
            expect( first.innerHTML ).toEqual( 'MyFirstModule' );
            expect( second.innerHTML ).toEqual( 'MySecondModule' );
            expect( third.innerHTML ).toEqual( 'MyThirdModule' );
        } );
        
        it( 'should limit starting of modules to a dom node, when specified', async () => {
            
            glue.registerModule( 'MyFirstModule', MyFirstModule );
            glue.registerModule( 'MySecondModule', MySecondModule );
            glue.registerModule( 'MyThirdModule', MyThirdModule );
            
            body.innerHTML = `
                <div id="domNode">
                    <div id="first" data-js-module="MyFirstModule"></div>
                    <div id="second" data-js-module="MySecondModule"></div>
                </div>
                <div id="third" data-js-module="MyThirdModule"></div>
            `;
            
            const domNode = document.getElementById( 'domNode' );
            
            await glue.start( domNode );
            
            const first  = document.getElementById( 'first' );
            const second = document.getElementById( 'second' );
            const third  = document.getElementById( 'third' );
            
            expect( first.innerHTML ).toEqual( 'MyFirstModule' );
            expect( second.innerHTML ).toEqual( 'MySecondModule' );
            expect( third.innerHTML ).toEqual( '' );
            
        } );
        
        it( 'should throw when 1st param is not a dom node', async () => {
            
            try {
                await glue.start( document.getElementById( 'meNotExist' ) );
            } catch ( err ) {
                expect( err.message ).toEqual( GlueErrors.NOT_A_DOM_ELEMENT );
                return;
            }
            
            try {
                await glue.start( null );
            } catch ( err ) {
                expect( err.message ).toEqual( GlueErrors.NOT_A_DOM_ELEMENT );
                return;
            }
            
            throw new Error( 'Promise should not be resolved' );
        } );
        
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
            body.innerHTML   = `<div id="el" data-js-module="${ moduleName }"></div>`;
            const el         = document.getElementById( 'el' );
            
            await glue.start();
            
            expect( console.warn ).toHaveBeenCalledWith( warning, el );
        } );
        
        it( 'should warn when module start fails', async () => {
            
            spyOn( console, 'warn' );
            
            glue.registerModule( 'StartFailModule', StartFailModule );
            
            const moduleName = 'StartFailModule';
            const warning    = renderTemplate( GlueWarnings.START_FAILED, { name : moduleName } );
            body.innerHTML   = `<div id="el" data-js-module="${ moduleName }"></div>`;
            
            await glue.start();
            
            expect( console.warn ).toHaveBeenCalledWith( warning, DummyError );
            
        } );
        
        it( 'should start nested modules when needed', async () => {
            
            const spy = {
                one          : async () => {},
                two          : async () => {},
                three        : async () => {},
                unmountThree : async () => {},
                unmountTwo   : async () => {},
                unmountOne   : async () => {},
            };
            
            const spyOne          = spyOn( spy, 'one' );
            const spyTwo          = spyOn( spy, 'two' );
            const spyThree        = spyOn( spy, 'three' );
            const spyUnmountOne   = spyOn( spy, 'unmountThree' );
            const spyUnmountTwo   = spyOn( spy, 'unmountTwo' );
            const spyUnmountThree = spyOn( spy, 'unmountOne' );
            
            body.innerHTML = `<div id="FirstLevel" data-js-module="FirstLevel"></div>`;
            
            class FirstLevel extends GlueModule {
                async render() {
                    return `<div id="SecondLevel" data-js-module="SecondLevel"></div>`;
                }
                
                async start() {
                    await super.start();
                    await spyOne();
                }
                
                async afterUnmount() {
                    await spyUnmountOne();
                }
            }
            
            class SecondLevel extends GlueModule {
                async render() {
                    return `<div id="ThirdLevel" data-js-module="ThirdLevel"></div>`;
                }
                
                async start() {
                    await super.start();
                    await spyTwo();
                }
                
                async afterUnmount() {
                    await spyUnmountTwo();
                }
            }
            
            class ThirdLevel extends GlueModule {
                async render() {
                    return `DONE`;
                }
                
                async start() {
                    await super.start();
                    await spyThree();
                }
                
                async afterUnmount() {
                    await spyUnmountThree();
                }
            }
            
            glue.registerModule( 'SecondLevel', SecondLevel );
            glue.registerModule( 'ThirdLevel', ThirdLevel );
            glue.registerModule( 'FirstLevel', FirstLevel );
            
            await glue.start();
            
            const first  = document.getElementById( 'FirstLevel' );
            const second = document.getElementById( 'SecondLevel' );
            const third  = document.getElementById( 'ThirdLevel' );
            
            const secondId = second.getAttribute( 'data-js-module-id' );
            const thirdId  = third.getAttribute( 'data-js-module-id' );
            
            expect( third.innerHTML ).toEqual(
                'DONE'
            );
            
            expect( second.innerHTML ).toEqual(
                '<div id="ThirdLevel" data-js-module="ThirdLevel" data-js-module-id="' + thirdId + '">' +
                'DONE' +
                '</div>'
            );
            
            expect( first.innerHTML ).toEqual(
                '<div id="SecondLevel" data-js-module="SecondLevel" data-js-module-id="' + secondId + '">' +
                '<div id="ThirdLevel" data-js-module="ThirdLevel" data-js-module-id="' + thirdId + '">' +
                'DONE' +
                '</div>' +
                '</div>'
            );
            
            expect( spyThree ).toHaveBeenCalledTimes( 1 );
            expect( spyTwo ).toHaveBeenCalledTimes( 1 );
            expect( spyOne ).toHaveBeenCalledTimes( 1 );
            
            expect( spyTwo ).toHaveBeenCalledBefore( spyThree );
            expect( spyOne ).toHaveBeenCalledBefore( spyTwo );
            
            await glue.stop();
            
            expect( spyUnmountThree ).toHaveBeenCalledTimes( 1 );
            expect( spyUnmountTwo ).toHaveBeenCalledTimes( 1 );
            expect( spyUnmountOne ).toHaveBeenCalledTimes( 1 );
            
            expect( spyUnmountThree ).toHaveBeenCalledBefore( spyUnmountTwo );
            expect( spyUnmountTwo ).toHaveBeenCalledBefore( spyUnmountOne );
            
        } );
        
    } );
    
    describe( 'stop()', () => {
        
        it( 'should throw when 1st param is not a dom node', async () => {
            
            try {
                await glue.stop( document.getElementById( 'meNotExist' ) );
            } catch ( err ) {
                expect( err.message ).toEqual( GlueErrors.NOT_A_DOM_ELEMENT );
                return;
            }
            
            try {
                await glue.stop( null );
            } catch ( err ) {
                expect( err.message ).toEqual( GlueErrors.NOT_A_DOM_ELEMENT );
                return;
            }
            
            throw new Error( 'Promise should not be resolved' );
        } );
        
        it( 'should warn when module stop fails', async () => {
            
            spyOn( console, 'warn' );
            
            glue.registerModule( 'StopFailModule', StopFailModule );
            
            const moduleName = 'StopFailModule';
            const warning    = renderTemplate( GlueWarnings.STOP_FAILED, { name : moduleName } );
            body.innerHTML   = `<div id="el" data-js-module="${ moduleName }"></div>`;
            
            await glue.start();
            await glue.stop();
            
            expect( console.warn ).toHaveBeenCalledWith( warning, DummyError );
            
        } );
        
        it( 'should stop all modules in root dom node by default', async () => {
            
            class MyFirstModule extends GlueModule {
                async render() {
                    return 'MyFirstModule';
                }
            }
            
            class MySecondModule extends GlueModule {
                async render() {
                    return 'MySecondModule';
                }
            }
            
            class MyThirdModule extends GlueModule {
                async render() {
                    return 'MyThirdModule';
                }
            }
            
            glue.registerModule( 'MyFirstModule', MyFirstModule );
            glue.registerModule( 'MySecondModule', MySecondModule );
            glue.registerModule( 'MyThirdModule', MyThirdModule );
            
            body.innerHTML = `
                <div id="first" data-js-module="MyFirstModule"></div>
                <div id="second" data-js-module="MySecondModule"></div>
                <div id="third" data-js-module="MyThirdModule"></div>
            `;
            
            await glue.start();
            
            const first  = document.getElementById( 'first' );
            const second = document.getElementById( 'second' );
            const third  = document.getElementById( 'third' );
            
            expect( first.innerHTML ).toEqual( 'MyFirstModule' );
            expect( second.innerHTML ).toEqual( 'MySecondModule' );
            expect( third.innerHTML ).toEqual( 'MyThirdModule' );
            
            await glue.stop();
            
            expect( first.innerHTML ).toEqual( '' );
            expect( second.innerHTML ).toEqual( '' );
            expect( third.innerHTML ).toEqual( '' );
            
        } );
        
        it( 'should stop all modules of a given dom node', async () => {
            
            class MyFirstModule extends GlueModule {
                async render() {
                    return 'MyFirstModule';
                }
            }
            
            class MySecondModule extends GlueModule {
                async render() {
                    return 'MySecondModule';
                }
            }
            
            class MyThirdModule extends GlueModule {
                async render() {
                    return 'MyThirdModule';
                }
            }
            
            glue.registerModule( 'MyFirstModule', MyFirstModule );
            glue.registerModule( 'MySecondModule', MySecondModule );
            glue.registerModule( 'MyThirdModule', MyThirdModule );
            
            body.innerHTML = `
                <div id="domNode">
                    <div id="first" data-js-module="MyFirstModule"></div>
                    <div id="second" data-js-module="MySecondModule"></div>
                </div>
                <div id="third" data-js-module="MyThirdModule"></div>
            `;
            
            await glue.start();
            
            const domNode = document.getElementById( 'domNode' );
            const first   = document.getElementById( 'first' );
            const second  = document.getElementById( 'second' );
            const third   = document.getElementById( 'third' );
            
            expect( first.innerHTML ).toEqual( 'MyFirstModule' );
            expect( second.innerHTML ).toEqual( 'MySecondModule' );
            expect( third.innerHTML ).toEqual( 'MyThirdModule' );
            
            await glue.stop( domNode );
            
            expect( first.innerHTML ).toEqual( '' );
            expect( second.innerHTML ).toEqual( '' );
            expect( third.innerHTML ).toEqual( 'MyThirdModule' );
            
        } );
        
        it( 'should stop nested modules', async () => {
            
            const spy = {
                one   : async () => {},
                two   : async () => {},
                three : async () => {}
            };
            
            const spyOne   = spyOn( spy, 'one' );
            const spyTwo   = spyOn( spy, 'two' );
            const spyThree = spyOn( spy, 'three' );
            
            body.innerHTML = `<div id="FirstLevel" data-js-module="FirstLevel"></div>`;
            
            class FirstLevel extends GlueModule {
                async render() {
                    return `<div id="SecondLevel" data-js-module="SecondLevel"></div>`;
                }
                
                async stop() {
                    await spyOne();
                    await super.stop();
                }
            }
            
            class SecondLevel extends GlueModule {
                async render() {
                    return `<div id="ThirdLevel" data-js-module="ThirdLevel"></div>`;
                }
                
                async stop() {
                    await spyTwo();
                    await super.stop();
                }
            }
            
            class ThirdLevel extends GlueModule {
                async render() {
                    return `DONE`;
                }
                
                async stop() {
                    await spyThree();
                    await super.stop();
                }
            }
            
            glue.registerModule( 'SecondLevel', SecondLevel );
            glue.registerModule( 'ThirdLevel', ThirdLevel );
            glue.registerModule( 'FirstLevel', FirstLevel );
            
            await glue.start();
            
            const first  = document.getElementById( 'FirstLevel' );
            const second = document.getElementById( 'SecondLevel' );
            const third  = document.getElementById( 'ThirdLevel' );
            
            const secondId = second.getAttribute( 'data-js-module-id' );
            const thirdId  = third.getAttribute( 'data-js-module-id' );
            
            expect( third.innerHTML ).toEqual( 'DONE' );
            
            expect( second.innerHTML ).toEqual(
                '<div id="ThirdLevel" data-js-module="ThirdLevel" data-js-module-id="' + thirdId + '">' +
                'DONE' +
                '</div>'
            );
            
            expect( first.innerHTML ).toEqual(
                '<div id="SecondLevel" data-js-module="SecondLevel" data-js-module-id="' + secondId + '">' +
                '<div id="ThirdLevel" data-js-module="ThirdLevel" data-js-module-id="' + thirdId + '">' +
                'DONE' +
                '</div>' +
                '</div>'
            );
            
            await glue.stop();
            
            expect( first.innerHTML ).toEqual( '' );
            
            expect( spyOne ).toHaveBeenCalledTimes( 1 );
            expect( spyTwo ).toHaveBeenCalledTimes( 1 );
            expect( spyThree ).toHaveBeenCalledTimes( 1 );
            
            expect( document.getElementById( 'ThirdLevel' ) ).toEqual( null );
            expect( document.getElementById( 'SecondLevel' ) ).toEqual( null );
            
            expect( spyThree ).toHaveBeenCalledBefore( spyTwo );
            expect( spyTwo ).toHaveBeenCalledBefore( spyOne );
            
        } );
        
        it( 'should stop nested modules of given dom node', async () => {
            
            const spy = {
                one   : async () => {},
                two   : async () => {},
                three : async () => {}
            };
            
            const spyOne   = spyOn( spy, 'one' );
            const spyTwo   = spyOn( spy, 'two' );
            const spyThree = spyOn( spy, 'three' );
            
            body.innerHTML = `<div id="FirstLevel" data-js-module="FirstLevel"></div>`;
            
            class FirstLevel extends GlueModule {
                async render() {
                    return `<div id="SecondLevel" data-js-module="SecondLevel"></div>`;
                }
                
                async stop() {
                    await spyOne();
                    await super.stop();
                }
            }
            
            class SecondLevel extends GlueModule {
                async render() {
                    return `<div id="ThirdLevel" data-js-module="ThirdLevel"></div>`;
                }
                
                async stop() {
                    await spyTwo();
                    await super.stop();
                }
            }
            
            class ThirdLevel extends GlueModule {
                async render() {
                    return `DONE`;
                }
                
                async stop() {
                    await spyThree();
                    await super.stop();
                }
            }
            
            glue.registerModule( 'SecondLevel', SecondLevel );
            glue.registerModule( 'ThirdLevel', ThirdLevel );
            glue.registerModule( 'FirstLevel', FirstLevel );
            
            await glue.start();
            
            const first  = document.getElementById( 'FirstLevel' );
            const second = document.getElementById( 'SecondLevel' );
            const third  = document.getElementById( 'ThirdLevel' );
            
            const secondId = second.getAttribute( 'data-js-module-id' );
            const thirdId  = third.getAttribute( 'data-js-module-id' );
            
            expect( third.innerHTML ).toEqual( 'DONE' );
            
            expect( second.innerHTML ).toEqual(
                '<div id="ThirdLevel" data-js-module="ThirdLevel" data-js-module-id="' + thirdId + '">' +
                'DONE' +
                '</div>'
            );
            
            expect( first.innerHTML ).toEqual(
                '<div id="SecondLevel" data-js-module="SecondLevel" data-js-module-id="' + secondId + '">' +
                '<div id="ThirdLevel" data-js-module="ThirdLevel" data-js-module-id="' + thirdId + '">' +
                'DONE' +
                '</div>' +
                '</div>'
            );
            
            await glue.stop( second );
            
            expect( first.innerHTML ).toEqual( '<div id="SecondLevel" data-js-module="SecondLevel"></div>' );
            
            expect( spyOne ).toHaveBeenCalledTimes( 0 );
            expect( spyTwo ).toHaveBeenCalledTimes( 1 );
            expect( spyThree ).toHaveBeenCalledTimes( 1 );
            
            expect( document.getElementById( 'ThirdLevel' ) ).toEqual( null );
            
            expect( spyThree ).toHaveBeenCalledBefore( spyTwo );
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
            
            class MyConfig extends GlueConfig {
                ROOT_ELEMENT = document.getElementById( '404' ) as Element;
            }
            
            expect( () => new Glue( new MyConfig() ) ).toThrow(
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
                glue.getUnstartedDomNodes()
            ).toEqual( [] );
            
        } );
        
    } );
    
    describe( 'getStartedDomNodes()', () => {
        
        it( 'should have a method to return all started modules dom nodes', () => {
            expect( glue.getStartedDomNodes ).toBeDefined();
        } );
        
        it( 'should return all started modules dom nodes', () => {
            body.innerHTML = `
                <div data-js-module="one"></div>
                <div data-js-module="two" data-js-module-id="id12345"></div>
                <div data-js-module="three" data-js-module-id="id98765"></div>
                <div data-js-module="four"></div>
            `;
            
            expect(
                glue.getStartedDomNodes( body ).map( n => n.getAttribute( 'data-js-module' ) )
            ).toEqual( [ 'two', 'three' ] );
            
            body.innerHTML = `
                <div data-js-module="one" data-js-module-id="id1aa2345"></div>
                <div data-js-module="two" data-js-module-id="id12345"></div>
                <div data-js-module="three" data-js-module-id="id98765"></div>
                <div data-js-module="four" data-js-module-id="id987dd65"></div>
            `;
            
            expect(
                glue.getStartedDomNodes().map( n => n.getAttribute( 'data-js-module-id' ) )
            ).toEqual( [ 'id1aa2345', 'id12345', 'id98765', 'id987dd65' ] );
            
        } );
        
        describe( 'getStartedDomNodes()', () => {
            
            it( 'should have a method to return all started modules dom nodes', () => {
                expect( glue.getStartedDomNodes ).toBeDefined();
            } );
            
            it( 'should return all started modules dom nodes', () => {
                body.innerHTML = `
                    <div data-js-module="one"></div>
                    <div data-js-module="two" data-js-module-id="id12345"></div>
                    <div data-js-module="three" data-js-module-id="id98765"></div>
                    <div data-js-module="four"></div>
                `;
                
                expect(
                    glue.getStartedDomNodes( body ).map( n => n.getAttribute( 'data-js-module' ) )
                ).toEqual( [ 'two', 'three' ] );
                
                body.innerHTML = `
                    <div data-js-module="one" data-js-module-id="id1aa2345"></div>
                    <div data-js-module="two" data-js-module-id="id12345"></div>
                    <div data-js-module="three" data-js-module-id="id98765"></div>
                    <div data-js-module="four" data-js-module-id="id987dd65"></div>
                `;
                
                expect(
                    glue.getStartedDomNodes().map( n => n.getAttribute( 'data-js-module-id' ) )
                ).toEqual( [ 'id1aa2345', 'id12345', 'id98765', 'id987dd65' ] );
                
            } );
            
        } );
        
    } );
    
} );