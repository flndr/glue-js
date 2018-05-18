import GlueModule from '../../../../src/Glue/GlueModule';

export const ISO_TEST_STEP_ONE_MARKUP = '<h1>hello ibe</h1>';

export class ISO_TEST_STEP_ONE extends GlueModule {
    async render() {
        return ISO_TEST_STEP_ONE_MARKUP;
    }
}