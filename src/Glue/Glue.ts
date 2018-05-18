import { isDomElement } from '../Util/Dom';
import { renderTemplate } from '../Util/String';

import GlueConfigInterface from './GlueConfigInterface';
import GlueModuleInterface from './GlueModuleInterface';
import GlueConfig from './GlueConfig';
import GlueErrors from './GlueErrors';
import GlueModule from './GlueModule';
import GlueWarnings from './GlueWarnings';

export default class Glue {
    
    readonly CONFIG : GlueConfigInterface;
    
    private lazyModules : { [ key : string ] : () => Promise<any> }                  = {};
    private registeredModules : { [ key : string ] : new () => GlueModuleInterface } = {};
    private runningModules : { [ key : string ] : GlueModuleInterface }              = {};
    
    constructor( config = GlueConfig ) {
        
        if ( !isDomElement( config.ROOT_ELEMENT ) ) {
            throw new Error( GlueErrors.ROOT_ELEMENT_FAIL );
        }
        
        this.CONFIG = config;
    }
    
    public getRootElement() : Element {
        return this.CONFIG.ROOT_ELEMENT;
    }
    
    public registerModule( name : string, module : new () => GlueModule ) : void {
        
        if ( !name || typeof name !== 'string' || name === '' ) {
            throw new Error( GlueErrors.NOT_A_STRING );
        }
        
        if ( !module || typeof module !== 'function' ) {
            throw new Error( GlueErrors.NOT_A_GLUE_MODULE );
        }
        
        const inst = new module();
        
        if ( !(inst instanceof GlueModule) ) {
            throw new Error( GlueErrors.NOT_A_GLUE_MODULE );
        }
        
        if ( this.registeredModules.hasOwnProperty( name ) ) {
            const msg = renderTemplate( GlueErrors.ALREADY_REGISTERED, { name } );
            throw new Error( msg );
        }
        
        this.registeredModules[ name ] = module;
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
    
        if ( !importedFileContents || !importedFileContents.hasOwnProperty( 'default' ) ) {
            throw new Error( GlueErrors.LAZY_IMPORT_HAS_NO_DEFAULT );
        }
    
        return importedFileContents.default;
    }
    
    private async startModule( el : Element ) : Promise<void> {
        
        const moduleName : string = this.getModuleNameFromElement( el );
        
        if ( !this.isModuleRegistered( moduleName ) ) {
            const msg = renderTemplate( GlueWarnings.START_MODULE_NOT_REGISTERED, { name : moduleName } );
            console.warn( msg, el );
            return;
        }
    
        if ( this.isLazyModule( moduleName ) ) {
            const creator = await this.loadLazyModule( moduleName );
            this.registerModule( moduleName, creator );
            delete this.lazyModules[ moduleName ];
        }
        
        try {
            
            const moduleClass = this.registeredModules[ moduleName ];
            
            const module : GlueModuleInterface = new moduleClass();
            
            module.element = el;
            module.config  = this.getConfigClone();
            
            await module.start();
    
            // children
            await this.start( module.element );

            this.runningModules[ module.id ] = module;
            
        } catch ( e ) {
            const msg = renderTemplate( GlueWarnings.START_FAILED, { name : moduleName } );
            console.warn( msg, e );
            return;
        }
    }
    
    public async start( domNode : Element = this.CONFIG.ROOT_ELEMENT ) : Promise<void> {
    
        if ( !domNode || !isDomElement( domNode ) ) {
            throw new Error( GlueErrors.NOT_A_DOM_ELEMENT );
        }
        
        const modules : Element[] = this.getUnstartedDomNodes( domNode );
        
        await Promise.all( modules.map(
            async ( m : Element ) => await this.startModule( m )
        ) );
    }
    
    public async stop( domNode : Element = this.CONFIG.ROOT_ELEMENT ) : Promise<void> {
        
        if ( !domNode || !isDomElement( domNode ) ) {
            throw new Error( GlueErrors.NOT_A_DOM_ELEMENT );
        }
        
        const startedModules : Element[] = this.getStartedDomNodes( domNode );
        
        if ( startedModules.length > 0 ) {
            await Promise.all( startedModules.map(
                async ( m : Element ) => await this.stop( m )
            ) );
        }
        
        if ( domNode.hasAttribute( this.CONFIG.ATTR_MODULE_ID ) ) {
            await this.stopModule( domNode );
        }
        
    }
    
    private async stopModule( el : Element ) : Promise<void> {
        
        const moduleId : string   = this.getModuleIdFromElement( el );
        const moduleName : string = this.getModuleNameFromElement( el );
        
        if ( !this.runningModules.hasOwnProperty( moduleId ) ) {
            return;
        }
        
        try {
    
            const moduleInstance = this.runningModules[ moduleId ];
    
            delete this.runningModules[ moduleId ];
            
            await moduleInstance.stop();
            
        } catch ( e ) {
            const msg = renderTemplate( GlueWarnings.STOP_FAILED, { name : moduleName } );
            console.warn( msg, e );
            return;
        }
    }
    
    public getUnstartedDomNodes( domNode : Element = this.CONFIG.ROOT_ELEMENT ) : Element[] {
        return Array.from(
            domNode.querySelectorAll(
                `[${this.CONFIG.ATTR_MODULE_NAME}]:not([${this.CONFIG.ATTR_MODULE_ID}])`
            )
        );
    }
    
    public getStartedDomNodes( domNode : Element = this.CONFIG.ROOT_ELEMENT ) : Element[] {
        return Array.from(
            domNode.querySelectorAll( `[${this.CONFIG.ATTR_MODULE_ID}]` )
        );
    }
    
    private getModuleNameFromElement( element : Element ) : string {
        return element.getAttribute( this.CONFIG.ATTR_MODULE_NAME ) as string;
    }
    
    private getModuleIdFromElement( element : Element ) : string {
        return element.getAttribute( this.CONFIG.ATTR_MODULE_ID ) as string;
    }
    
    public getConfigClone() : GlueConfigInterface {
        return { ... this.CONFIG };
    }
    
}