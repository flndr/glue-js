import { DummyError } from './DummyError';
import GlueModule from '../../../src/Glue/GlueModule';

export default class StartFailModule extends GlueModule {
    async start() {
        await super.start();
        throw DummyError;
    }
}