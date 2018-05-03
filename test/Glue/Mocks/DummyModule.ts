
import { DummyMarkup } from './DummyMarkup';
import GlueModule from '../../../src/Glue/GlueModule';

export default class DummyModule extends GlueModule {
    get name() { return 'DummyModule'; }
    public async render() : Promise<string> {
        return DummyMarkup;
    }
}