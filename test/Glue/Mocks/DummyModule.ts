
import { DummyMarkup } from './DummyMarkup';
import GlueModule from '../../../src/Glue/GlueModule';

export default class DummyModule extends GlueModule {
    public async render() : Promise<string> {
        return DummyMarkup;
    }
}