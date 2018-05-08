import GlueModuleInterface from './GlueModuleInterface';
import GlueConfig from './GlueConfig';
export default abstract class GlueModule implements GlueModuleInterface {
    private _id;
    private _el;
    private _config;
    protected oldMarkup: string;
    protected newMarkup: string;
    element: Element;
    config: GlueConfig;
    readonly id: string;
    start(): Promise<void>;
    private assignId();
    private removeId();
    private injectMarkup();
    private restoreMarkup();
    render(): Promise<string>;
    stop(): Promise<void>;
}
