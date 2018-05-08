import { createUniqueId } from '../Util/Dom';
import GlueModuleInterface from './GlueModuleInterface';
import GlueConfig from './GlueConfig';

export default abstract class GlueModule implements GlueModuleInterface {
    
    private _id : string;
    private _el : Element;
    private _config : GlueConfig;
    
    protected oldMarkup : string;
    protected newMarkup : string;
    
    public get element() : Element {
        return this._el;
    }

    public set element( el : Element ) {
        this._el = el;
    }
    
    public get config() : GlueConfig {
        return this._config;
    }
    
    public set config( c : GlueConfig ) {
        this._config = c;
    }
    
    public get id() : string {
        return this._id;
    }
    
    public async start() : Promise<void> {
        this.assignId();
        await this.injectMarkup();
    }

    private assignId() {
        this._id = createUniqueId();
        this._el.setAttribute( this._config.ATTR_MODULE_ID, this._id );
    }
    
    private removeId() {
        this._el.removeAttribute( this.config.ATTR_MODULE_ID );
    }
    
    private async injectMarkup() {
        this.newMarkup = await this.render();

        if ( this.element && this.newMarkup && this.newMarkup !== '' ) {
            this.oldMarkup         = this.element.innerHTML;
            this.element.innerHTML = this.newMarkup;
        }
    }

    private restoreMarkup() {
        if ( this.element && this.oldMarkup !== null ) {
            this.element.innerHTML = this.oldMarkup;
        }
    }

    public async render() : Promise<string> {
        return null;
    }
    
    public async stop() : Promise<void> {
        this.restoreMarkup();
        this.removeId();
    }
}