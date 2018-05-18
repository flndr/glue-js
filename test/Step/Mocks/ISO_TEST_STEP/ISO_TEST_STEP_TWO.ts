import GlueModule from '../../../../src/Glue/GlueModule';

export const ISO_TEST_STEP_TWO_MARKUP = '<p>hello ibe workflow</p>';

export class ISO_TEST_STEP_TWO extends GlueModule {
    async render() {
        return ISO_TEST_STEP_TWO_MARKUP;
    }
}