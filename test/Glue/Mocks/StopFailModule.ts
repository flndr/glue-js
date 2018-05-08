import { DummyError } from './DummyError';
import GlueModule from '../../../src/Glue/GlueModule';

export default class StopFailModule extends GlueModule {
    async stop() {
        await super.stop();
        throw DummyError;
    }
}