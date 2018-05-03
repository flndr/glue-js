import GlueModuleInterface from './GlueModuleInterface';
export default abstract class GlueModule implements GlueModuleInterface {
    private _id;
    private _el;
    protected oldMarkup: string;
    protected newMarkup: string;
    element: Element;
    readonly name: string;
    readonly id: string;
    start(): Promise<void>;
    private assignId();
    private injectMarkup();
    private restoreMarkup();
    render(): Promise<string>;
    stop(): Promise<void>;
}
