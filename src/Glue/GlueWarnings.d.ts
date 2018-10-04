declare namespace GlueWarnings {
    const REGISTER_FIRST_PARAM_MUST_BE_STRING = "Could not register module: 1st parameter must be a string.";
    const REGISTER_SECOND_PARAM_MUST_BE_FUNC = "Could not register module: 2nd parameter must be a function.";
    const REGISTER_ALREADY_REGISTERED = "Could not register module: A module with this name was already registered before.";
    const ALREADY_STARTED = "This has no effect now. Configuration has to be done before starting.";
    const NOT_STARTED = "Not started. Method not available.";
    const START_MODULE_NOT_REGISTERED = "Could not start module: A module '{name}' is not registered.";
    const START_FAILED = "Starting of module '{name}' failed:";
    const STOP_FAILED = "Stoping of module '{name}' failed:";
}
export default GlueWarnings;
