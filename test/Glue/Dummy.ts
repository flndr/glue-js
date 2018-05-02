import GlueModule from '../../src/Glue/GlueModule';

export class Dummy extends GlueModule {
    public async render() : Promise<string> {
        return '<div>Lazy loaded markup</div>';
    }
}