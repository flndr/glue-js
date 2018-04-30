export default class GlueConfig {
    public ROOT_ELEMENT : Element    = document.getElementsByTagName( 'body' )[ 0 ];
    public ATTR_MODULE_NAME : string = 'data-js-module';
    public ATTR_MODULE_ID : string   = 'data-js-module-id';
    public ATTR_ELEMENT : string     = 'data-js-element';
}
