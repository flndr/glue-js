class GlueConfig {
    ROOT_ELEMENT : Element    = document.getElementsByTagName( 'body' )[ 0 ];
    ATTR_MODULE_NAME : string = 'data-js-module';
    ATTR_MODULE_ID : string   = 'data-js-module-id';
}

export const glueDefaultConfig = new GlueConfig();

export default GlueConfig;