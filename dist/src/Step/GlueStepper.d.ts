import GlueModule from '../Glue/GlueModule';
export default class GlueStepper {
    readonly el: Element;
    private glue;
    private glueConfig;
    private id;
    readonly ATTR_WORKFLOW_ID = "data-js-workflow-id";
    constructor(el: Element);
    registerModule(type: string, step: new () => GlueModule): void;
    goto(type: string): Promise<void>;
    stop(): Promise<void>;
    private injectStep;
    getContainerElement(): Element;
}
