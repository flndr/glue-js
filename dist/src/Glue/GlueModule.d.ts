import GlueModuleInterface from './GlueModuleInterface';
import GlueConfigInterface from './GlueConfigInterface';
export default abstract class GlueModule implements GlueModuleInterface {
    private _id;
    private _el;
    private _config;
    protected oldMarkup: string;
    protected newMarkup: string;
    beforeMount(): Promise<void>;
    afterMount(): Promise<void>;
    beforeUnmount(): Promise<void>;
    afterUnmount(): Promise<void>;
    element: Element;
    config: GlueConfigInterface;
    readonly id: string;
    start(): Promise<void>;
    private assignId();
    private removeId();
    private injectMarkup();
    private restoreMarkup();
    render(): Promise<string>;
    stop(): Promise<void>;
}
