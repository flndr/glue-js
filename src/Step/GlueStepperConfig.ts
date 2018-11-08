import GlueConfig from '../Glue/GlueConfig';

export default class GlueStepperConfig extends GlueConfig {
    ATTR_MODULE_ID         = 'data-js-step-id';
    ATTR_MODULE_NAME       = 'data-js-step';
    ROOT_ELEMENT : Element = document.getElementsByTagName( 'body' )[ 0 ];
}