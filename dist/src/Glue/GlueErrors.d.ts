declare namespace GlueErrors {
    const NOT_A_STRING = "Could not register module: Name must be a string.";
    const NOT_A_GLUE_MODULE = "Could not register module: Class must extend base module class.";
    const ALREADY_REGISTERED = "Could not register module: A module with name '{name}' was already registered before.";
    const ALREADY_STARTED = "This has no effect now. Configuration has to be done before starting.";
    const NOT_STARTED = "Not started. Method not available.";
    const NOT_A_DOM_ELEMENT = "Passed variable is not a native DOM element.";
    const ROOT_ELEMENT_FAIL = "Configuration Error: Root element is not a DOM Node.";
    const LAZY_IMPORT_HAS_NO_DEFAULT = "Lazy loaded module file has no default export.";
    const MODULE_INIT_ERROR = "Something went wrong when inititializing a module.";
}
export default GlueErrors;
