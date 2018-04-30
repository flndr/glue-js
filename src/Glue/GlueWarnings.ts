
export default class GlueWarnings {
    public static REGISTER_FIRST_PARAM_MUST_BE_STRING = "Could not register module: 1st parameter must be a string.";
    public static REGISTER_SECOND_PARAM_MUST_BE_FUNC  = "Could not register module: 2nd parameter must be a function.";
    public static REGISTER_ALREADY_REGISTERED         = "Could not register module: A module with this name was already registered before.";
    public static ALREADY_STARTED                     = "This has no effect now. Configuration has to be done before starting.";
    public static NOT_STARTED                         = "Not started. Method not available.";
    public static START_MODULE_NOT_REGISTERED         = "Could not start module: A module '{name}' is not registered.";
}
