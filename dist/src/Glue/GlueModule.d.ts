import GlueModuleInterface from './GlueModuleInterface';
import GlueConfigInterface from './GlueConfigInterface';
import Glue from './Glue';
export default abstract class GlueModule implements GlueModuleInterface {
    private _id;
    private _el;
    private _config;
    private _glue;
    protected oldMarkup: string;
    protected newMarkup: string;
    beforeMount(): Promise<void>;
    afterMount(): Promise<void>;
    beforeUnmount(): Promise<void>;
    afterUnmount(): Promise<void>;
    glue: Glue;
    element: Element;
    config: GlueConfigInterface;
    readonly id: string;
    start(): Promise<void>;
    private assignId;
    private removeId;
    private injectMarkup;
    private restoreMarkup;
    render(): Promise<string>;
    stop(): Promise<void>;
}
