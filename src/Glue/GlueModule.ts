import { createUniqueId } from '../Util/Dom';
import GlueModuleInterface from './GlueModuleInterface';

export default abstract class GlueModule implements GlueModuleInterface {
    
    private _id : string;
    private _el : Element;
    
    protected oldMarkup : string;
    protected newMarkup : string;
    
    public get element() : Element {
        return this._el;
    }

    public set element( el : Element ) {
        this._el = el;
    }
    
    public abstract get name() : string; /* {
        ATTENTION:
        if you don't ugily/mangle your code you can use this:
        return this.constructor.name;
        otherwise you have to return the name of the class:
        return 'GlueModule';
    } */
    
    public get id() : string {
        return this._id;
    }
    
    public async start() : Promise<void> {
        this.assignId();
        await this.injectMarkup();
    }

    private assignId() {
        this._id = createUniqueId();
    }
    
    private async injectMarkup() {
        this.newMarkup = await this.render();

        if ( this.element && this.newMarkup && this.newMarkup !== '' ) {
            this.oldMarkup         = this.element.innerHTML;
            this.element.innerHTML = this.newMarkup;
        }
    }

    private restoreMarkup() {
        if ( this.element && this.oldMarkup && this.oldMarkup !== '' ) {
            this.element.innerHTML = this.oldMarkup;
        }
    }

    public async render() : Promise<string> {
        return null;
    }
    
    public async stop() : Promise<void> {
        this.restoreMarkup();
    }
}