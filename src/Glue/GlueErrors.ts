class GlueErrors {
    static NOT_A_STRING               = "Could not register module: Name must be a string.";
    static NOT_A_GLUE_MODULE          = "Could not register module: Class must extend base module class.";
    static ALREADY_REGISTERED         = "Could not register module: A module with name '{name}' was already registered before.";
    static ALREADY_STARTED            = "This has no effect now. Configuration has to be done before starting.";
    static NOT_STARTED                = "Not started. Method not available.";
    static NOT_A_DOM_ELEMENT          = "Passed variable is not a native DOM element.";
    static ROOT_ELEMENT_FAIL          = "Configuration Error: Root element is not a DOM Node.";
    static LAZY_IMPORT_HAS_NO_DEFAULT = "Lazy loaded module file has no default export.";
    static LAZY_IMPORT_HAS_METHODS    = "Lazy loaded module file has no start, render and stop exports.";
    static MODULE_INIT_ERROR          = "Something went wrong when inititializing a module.";
}

export default GlueErrors;