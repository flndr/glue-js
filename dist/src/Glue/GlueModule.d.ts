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
    private _start();
    load(): Promise<void>;
    render(): Promise<string>;
    init(): Promise<void>;
    destroy(): Promise<void>;
    stop(): Promise<void>;
    private _stop();
}
