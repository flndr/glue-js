import GlueModule from '../../src/Glue/GlueModule';
import GlueConfig from '../../src/Glue/GlueConfig';

const body : Element = document.getElementsByTagName( 'body' )[ 0 ];

describe( 'GlueModule', () => {
    
    afterEach( () => {
        body.innerHTML = '';
    } );
    
    it( 'should return its id', async () => {
        
        class MyModule extends GlueModule {
        }
        
        const module   = new MyModule();
        module.element = document.createElement( 'div' );
        module.config  = GlueConfig;
        await module.start();
        
        expect( module.id ).toBeTruthy();
    } );
    
    it( 'should render markup when render() returns a string', async () => {
        
        body.innerHTML = `<div id="my-module" data-js-module="MyModule"></div>`;
        
        const MyModuleHTML = '<p>some<span>markup</span></p>';
        
        class MyModule extends GlueModule {
            async render() {
                return MyModuleHTML;
            }
        }
    
        const module   = new MyModule();
        module.element = document.getElementById( 'my-module' );
        module.config  = GlueConfig;
        await module.start();
    
        expect( module.element.innerHTML ).toBe( MyModuleHTML );
    } );
    
    it( 'should restore markup when stop() was called', async () => {
        
        const originalMarkup = '<p>some original markup of that dom node</p>';
        const injectedMarkup = '<div>some <strong>new</strong> markup of that dom node</div>';
        
        body.innerHTML = `<div id="my-module" data-js-module="MyModule">${originalMarkup}</div>`;
        
        class MyModule extends GlueModule {
            async render() {
                return injectedMarkup;
            }
        }
        
        const module   = new MyModule();
        module.element = document.getElementById( 'my-module' );
        module.config  = GlueConfig;
        
        await module.start();
        expect( module.element.innerHTML ).toBe( injectedMarkup );
        
        await module.stop();
        expect( module.element.innerHTML ).toBe( originalMarkup );
        
    } );
    
    it( 'should not replace markup when render() returns null ( default )', async () => {
    
        const originalMarkup = '<p>some original markup of that dom node</p>';
    
        body.innerHTML = `<div id="my-module" data-js-module="MyModule">${originalMarkup}</div>`;
        
        class MyModule extends GlueModule {
        }
    
        const module   = new MyModule();
        module.element = document.getElementById( 'my-module' );
        module.config  = GlueConfig;
    
        await module.start();
    
        expect( module.element.innerHTML ).toBe( originalMarkup );
    
    } );
    
    it( 'should be extendable', async () => {
        
        body.innerHTML = `<div id="my-module" data-js-module="MyModule"></div>`;
        
        const spy = {
            one   : async () => {},
            two   : async () => {},
            three : async () => {}
        };
        
        const spyOne   = spyOn( spy, 'one' );
        const spyTwo   = spyOn( spy, 'two' );
        const spyThree = spyOn( spy, 'three' );
        
        class MyModule extends GlueModule {
            public async start() : Promise<void> {
                await spyOne();
                await spyOne();
                await super.start();
                await spyTwo();
            }
            
            public async stop() : Promise<void> {
                await spyTwo();
                await super.stop();
                await spyTwo();
                await spyThree();
            }
        }
        
        const module   = new MyModule();
        module.element = document.getElementById( 'my-module' );
        module.config  = GlueConfig;
        
        await module.start();
        expect( spyOne ).toHaveBeenCalledTimes( 2 );
        expect( spyTwo ).toHaveBeenCalledTimes( 1 );
        expect( spyThree ).toHaveBeenCalledTimes( 0 );
        
        await module.stop();
        expect( spyOne ).toHaveBeenCalledTimes( 2 );
        expect( spyTwo ).toHaveBeenCalledTimes( 3 );
        expect( spyThree ).toHaveBeenCalledTimes( 1 );

    } );
    
} );