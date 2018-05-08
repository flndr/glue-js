interface GlueModuleInterface {
    id: string;
    element: Element;
    render(): Promise<string>;
    start(): Promise<void>;
    stop(): Promise<void>;
}
export default GlueModuleInterface;
