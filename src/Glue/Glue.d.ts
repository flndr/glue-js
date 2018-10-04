import GlueConfigInterface from './GlueConfigInterface';
import GlueConfig from './GlueConfig';
import GlueModule from './GlueModule';
export default class Glue {
    readonly CONFIG: GlueConfigInterface;
    private lazyModules;
    private registeredModules;
    private runningModules;
    constructor(config?: typeof GlueConfig);
    getRootElement(): Element;
    registerModule(name: string, module: new () => GlueModule): void;
    registerLazyModule(name: string, dynamicImportFunc: () => Promise<any>): void;
    isModuleRegistered(moduleName: string): boolean;
    private isLazyModule;
    private loadLazyModule;
    private startModule;
    start(domNode?: Element): Promise<void>;
    stop(domNode?: Element): Promise<void>;
    private stopModule;
    getUnstartedDomNodes(domNode?: Element): Element[];
    getStartedDomNodes(domNode?: Element): Element[];
    private getModuleNameFromElement;
    private getModuleIdFromElement;
    getConfigClone(): GlueConfigInterface;
}
