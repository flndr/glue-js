import GlueModule from '../../../src/Glue/GlueModule';
export default class StopFailModule extends GlueModule {
    stop(): Promise<void>;
}
