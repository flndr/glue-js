import GlueConfig from './GlueConfig';
interface GlueModuleInterface {
    id: string;
    element: Element;
    config: GlueConfig;
    render(): Promise<string>;
    start(): Promise<void>;
    stop(): Promise<void>;
}
export default GlueModuleInterface;
