import GlueConfigInterface from './GlueConfigInterface';
interface GlueModuleInterface {
    id: string;
    element: Element;
    config: GlueConfigInterface;
    render(): Promise<string>;
    start(): Promise<void>;
    stop(): Promise<void>;
    beforeMount(): Promise<void>;
    afterMount(): Promise<void>;
    beforeUnmount(): Promise<void>;
    afterUnmount(): Promise<void>;
}
export default GlueModuleInterface;
