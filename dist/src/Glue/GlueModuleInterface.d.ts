interface GlueModuleInterface {
    id: string;
    name: string;
    element: Element;
    render(): Promise<string>;
    start(): Promise<void>;
    stop(): Promise<void>;
}
export default GlueModuleInterface;
