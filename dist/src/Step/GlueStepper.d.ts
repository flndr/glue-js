import GlueModule from '../Glue/GlueModule';
export default class GlueStepper {
    readonly el: Element;
    private glue;
    private glueConfig;
    private id;
    readonly ATTR_WORKFLOW_ID: string;
    constructor(el: Element);
    registerModule(type: string, step: new () => GlueModule): void;
    goto(type: string): Promise<void>;
    stop(): Promise<void>;
    private injectStep(type);
    getContainerElement(): Element;
}
