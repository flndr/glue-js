import { isDomElement } from '../Util/Dom';
import { renderTemplate } from '../Util/String';

import GlueModuleInterface from './GlueModuleInterface';
import GlueConfig from './GlueConfig';
import GlueErrors from './GlueErrors';
import GlueModule from './GlueModule';
import GlueWarnings from './GlueWarnings';

export default class Glue {
    
    private CONFIG : GlueConfig;
    
    private lazyModules : { [ key : string ] : () => Promise<any> }                  = {};
    private registeredModules : { [ key : string ] : new () => GlueModuleInterface } = {};
    private runningModules : { [ key : string ] : GlueModuleInterface }              = {};
    
    constructor( config : GlueConfig = new GlueConfig() ) {
        
        if ( !isDomElement( config.ROOT_ELEMENT ) ) {
            throw new Error( GlueErrors.ROOT_ELEMENT_FAIL );
        }
        
        this.CONFIG = config;
    }
    
    public getRootElement() : Element {
        return this.CONFIG.ROOT_ELEMENT;
    }
    
    public registerModule( module : new () => GlueModule ) : void {
        
        if ( typeof module !== 'function' ) {
            throw new Error( GlueErrors.NOT_A_GLUE_MODULE );
        }
        
        const inst = new module();
        
        if ( !(inst instanceof GlueModule) ) {
            throw new Error( GlueErrors.NOT_A_GLUE_MODULE );
        }
        
        if ( this.registeredModules.hasOwnProperty( inst.name ) ) {
            const msg = renderTemplate( GlueErrors.ALREADY_REGISTERED, { name : inst.name } );
            throw new Error( msg );
        }
        
        this.registeredModules[ inst.name ] = module;
    }
    
    public registerLazyModule( name : string, dynamicImportFunc : () => Promise<any> ) : void {
        this.lazyModules[ name ] = dynamicImportFunc;
    }
    
    public isModuleRegistered( moduleName : string ) : boolean {
        return this.registeredModules.hasOwnProperty( moduleName ) ||
            this.lazyModules.hasOwnProperty( moduleName );
    }
    
    private isLazyModule( moduleName : string ) : boolean {
        return this.lazyModules.hasOwnProperty( moduleName );
    }
    
    private async loadLazyModule( moduleName : string ) : Promise<any> {
        const importedFileContents = await this.lazyModules[ moduleName ]();
        return importedFileContents;
    }
    
    private async startModule( el : Element ) : Promise<void> {
        
        const moduleName : string = this.getModuleNameFromElement( el );
        
        if ( !this.isModuleRegistered( moduleName ) ) {
            const msg = renderTemplate( GlueWarnings.START_MODULE_NOT_REGISTERED, { moduleName } );
            this.warn( msg, el );
            return;
        }
    
        if ( this.isLazyModule( moduleName ) ) {
            const m = await this.loadLazyModule( moduleName );
            this.registerModule( m );
            delete this.lazyModules[ moduleName ];
        }
        
        try {
            
            const moduleClass = this.registeredModules[ moduleName ];
            
            const module : GlueModuleInterface = new moduleClass();
            
            module.element = el;
            
            await module.start();
            
            //if ( !module.id ) {
            //    throw new Error( GlueErrors.MODULE_INIT_ERROR );
            //}
            
            this.runningModules[ module.id ] = module;
            
        } catch ( e ) {
            this.warn( 'Failed instanciaton:', e );
            return;
        }
    }
    
    public async start( domNode : Element = this.CONFIG.ROOT_ELEMENT ) : Promise<void> {
        
        const modules : Element[] = this.getUnstartedDomNodes( domNode );
        
        await Promise.all( modules.map(
            async ( m : Element ) => await this.startModule( m )
        ) );
        
        return;
    }
    
    //private findAllModules( domNode : Element = this.CONFIG.ROOT_ELEMENT ) : Element[] {
    //    return Array.from( domNode.querySelectorAll( '[' + this.CONFIG.ATTR_MODULE_NAME + ']' ) );
    //}
    
    public getUnstartedDomNodes( domNode : Element = this.CONFIG.ROOT_ELEMENT ) : Element[] {
        return Array.from(
            domNode.querySelectorAll(
                `[${this.CONFIG.ATTR_MODULE_NAME}]:not([${this.CONFIG.ATTR_MODULE_ID}])`
            )
        );
    }
    
    private getModuleNameFromElement( element : Element ) : string {
        return element.getAttribute( this.CONFIG.ATTR_MODULE_NAME ) as string;
    }
    
    //private log( ... args : any[] ) : void {
    //    console.log( args );
    //}
    
    private warn( ... args : any[] ) : void {
        console.warn( args );
    }
    
}