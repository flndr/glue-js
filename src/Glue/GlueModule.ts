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
    
    public get name() : string {
        return this.constructor.name;
    }
    
    public get id() : string {
        return this._id;
    }
    
    public async start() : Promise<void> {
        this._id = createUniqueId();
        return this._start();
    }
    
    private async _start() : Promise<void> {
        
        await this.load();
        
        this.newMarkup = await this.render();
        
        if ( this.element && this.newMarkup && this.newMarkup !== '' ) {
            this.oldMarkup         = this.element.innerHTML;
            this.element.innerHTML = this.newMarkup;
        }
        
        await this.init();
    }
    
    public async load() : Promise<void> {
    }
    
    public async render() : Promise<string> {
        return '';
    }
    
    public async init() : Promise<void> {
    }
    
    public async destroy() : Promise<void> {
    }
    
    public async stop() : Promise<void> {
        await this.destroy();
        this._stop();
    }
    
    private _stop() : void {
        if ( this.element && this.oldMarkup && this.oldMarkup !== '' ) {
            this.element.innerHTML = this.oldMarkup;
        }
    }
}