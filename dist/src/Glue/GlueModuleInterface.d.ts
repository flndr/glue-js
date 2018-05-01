interface GlueModuleInterface {
    id: string;
    name: string;
    element: Element;
    start(): Promise<void>;
    load(): Promise<void>;
    render(): Promise<string>;
    init(): Promise<void>;
    stop(): Promise<void>;
}
export default GlueModuleInterface;
