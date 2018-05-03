import { DummyError } from './DummyError';
import GlueModule from '../../../src/Glue/GlueModule';

export default class StartFailModule extends GlueModule {
    public async start() : Promise<void> {
        await super.start();
        throw DummyError;
    }
}