import GlueConfig from './GlueConfig';
import GlueModule from './GlueModule';
export default class Glue {
    private CONFIG;
    private registeredModules;
    private runningModules;
    constructor(config?: GlueConfig);
    getRootElement(): Element;
    registerModule(module: new () => GlueModule): void;
    isModuleRegistered(moduleName: string): boolean;
    private startModule(el);
    start(domNode?: Element): Promise<void>;
    getUnstartedDomNodes(domNode?: Element): Element[];
    private getModuleNameFromElement(element);
    private warn(...args);
}
