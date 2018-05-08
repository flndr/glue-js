interface GlueModuleInterface {
    id : string; 
    element : Element;

    // LIFECYCLE

    // 1 - RENDER (optional)
    // will just inject returned markup into dom element
    render() : Promise<string>;

    // 2 - START (optional)
    // markup is now available, do something like
    // bind listeners, load further data and inject more markup, etc.
    start() : Promise<void>;

    // 3 - STOP
    // restores original markup of element, use this to
    // unbind listeners, etc.
    stop() : Promise<void>;

    /*

    for workflow-modules must be something like this

    start:
        beforeMount
        mount
        afterMount

    stop:
        beforeUnmount
        unmount
        afterUnmount

    */

}

export default GlueModuleInterface;