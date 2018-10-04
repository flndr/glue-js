import Glue from '../Glue/Glue';
import GlueConfig from '../Glue/GlueConfig';
import GlueModule from '../Glue/GlueModule';
import { createUniqueId } from '../Util/Dom';

export default class GlueStepper {
    
    readonly el : Element;
    
    private glue : Glue;
    private glueConfig = { ... GlueConfig };
    private id : string;
    
    readonly ATTR_WORKFLOW_ID = 'data-js-workflow-id';
    
    constructor( el : Element ) {
        this.el                          = el;
        this.glueConfig.ROOT_ELEMENT     = this.el;
        this.glueConfig.ATTR_MODULE_ID   = 'data-js-step-id';
        this.glueConfig.ATTR_MODULE_NAME = 'data-js-step';
        this.glue                        = new Glue( this.glueConfig );
    }
    
    public registerModule( type : string, step : new () => GlueModule ) {
        this.glue.registerModule( type, step );
    }
    
    public async goto( type : string ) : Promise<void> {
        
        if ( !this.glue.isModuleRegistered( type ) ) {
            throw new Error( 'NOPE, not here' );
        }
    
        await this.glue.stop();
        this.injectStep( type );
        await this.glue.start();
    }
    
    public async stop() : Promise<void> {
        await this.glue.stop();
        this.el.innerHTML = ''
    }
    
    private injectStep( type : string ) {
        if( !this.id ) {
            this.id = createUniqueId();
        }
        this.el.innerHTML = `<div ${this.ATTR_WORKFLOW_ID}="${this.id}" ${this.glueConfig.ATTR_MODULE_NAME}="${type}"></div>`;
    }
    
    public getContainerElement() : Element {
        return this.el.querySelector(`[${this.ATTR_WORKFLOW_ID}="${this.id}"]`) as Element;
    }
}