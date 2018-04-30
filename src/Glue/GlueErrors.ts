export default class GlueErrors {
    public static NOT_A_GLUE_MODULE  = "Could not register module: Class must extend base module class.";
    public static ALREADY_REGISTERED = "Could not register module: A module with name '{name}' was already registered before.";
    public static ALREADY_STARTED    = "This has no effect now. Configuration has to be done before starting.";
    public static NOT_STARTED        = "Not started. Method not available.";
    public static NOT_A_DOM_ELEMENT  = "Passed variable is not a native DOM element.";
    public static ROOT_ELEMENT_FAIL  = "Configuration Error: Root element is not a DOM Node.";
    public static MODULE_INIT_ERROR  = "Something went wrong when inititializing a module.";
}
