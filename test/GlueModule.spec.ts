import GlueModule from '../src/Glue/GlueModule';
import Glue from '../src/Glue/Glue';

let glue : Glue      = new Glue();
const body : Element = document.getElementsByTagName( 'body' )[ 0 ];

describe( 'GlueModule', () => {
    
    afterEach( () => {
        glue           = new Glue();
        body.innerHTML = '';
    } );
    
    it( 'should render markup when render() returns a string', async () => {
        
        body.innerHTML = `<div id="my-module" data-js-module="MyModule"></div>`;
        
        const MyModuleHTML = '<p>some<span>markup</span></p>';
        const MyModuleEl   = document.getElementById( 'my-module' ) as Element;
        
        class MyModule extends GlueModule {
            async render() : Promise<string> {
                return MyModuleHTML;
            }
        }
        
        glue = new Glue();
        glue.registerModule( MyModule );
        await glue.start();
        
        expect( MyModuleEl.innerHTML ).toBe( MyModuleHTML );
    } );
    
    it( 'should not replace markup when render() returns null ( default )', async () => {
        
        const MyModuleHTML = '<p>some<span>markup</span></p>';
        
        body.innerHTML = `<div id="my-module" data-js-module="MyModule">${MyModuleHTML}</div>`;
        
        const MyModuleEl : Element = document.getElementById( 'my-module' ) as Element;
        
        class MyModule extends GlueModule {
        }
        
        glue = new Glue();
        glue.registerModule( MyModule );
        await glue.start();
        
        expect( MyModuleEl.innerHTML ).toBe( MyModuleHTML );
        
    } );
    
} );