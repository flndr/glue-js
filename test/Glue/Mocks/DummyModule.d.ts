import GlueModule from '../../../src/Glue/GlueModule';
export default class DummyModule extends GlueModule {
    render(): Promise<string>;
}
