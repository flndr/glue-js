import GlueConfig from './GlueConfig';
import GlueModule from './GlueModule';
export default class Glue {
    private CONFIG;
    private lazyModules;
    private registeredModules;
    private runningModules;
    constructor(config?: GlueConfig);
    getRootElement(): Element;
    registerModule(module: new () => GlueModule): void;
    registerLazyModule(name: string, dynamicImportFunc: () => Promise<any>): void;
    isModuleRegistered(moduleName: string): boolean;
    private isLazyModule(moduleName);
    private loadLazyModule(moduleName);
    private startModule(el);
    start(domNode?: Element): Promise<void>;
    getUnstartedDomNodes(domNode?: Element): Element[];
    private getModuleNameFromElement(element);
    private warn(...args);
}
