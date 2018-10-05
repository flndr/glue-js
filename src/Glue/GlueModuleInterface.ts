import GlueConfigInterface from './GlueConfigInterface';
import Glue from './Glue';

interface GlueModuleInterface {
    id : string;
    element : Element;
    config : GlueConfigInterface;
    glue : Glue;

    // LIFECYCLE

    // 1 - RENDER (optional)
    // will just inject returned markup into dom element
    render() : Promise<string>;

    // 2 - START / MOUNT
    // markup is now available, do something like
    // bind listeners, load further data and inject more markup, etc.
    start() : Promise<void>;

    // 3 - STOP / UNMOUNT
    // restores original markup of element, use this to
    // unbind listeners, etc.
    stop() : Promise<void>;
    
    
    
    
    
    
    
    
    beforeMount() : Promise<void>;
    
    afterMount() : Promise<void>;
    
    beforeUnmount() : Promise<void>;
    
    afterUnmount() : Promise<void>;
    
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

    /*
    
        workflow-step
        
        input data on start
            - booking-state LOAD ( ajax-response, contains current booking and current step )
            - app-state ( from url and/or session )
        
        ... user is selecting stuff,
          entering data to generate/update ...
        
        output data before stop
            - booking-state SAVE ( ajax-response, contains current booking and current step selection )
            - app-state ( from url and/or session )
            
    */

    /*
    
        https://reactjs.org/docs/higher-order-components.html
        build a HOC component that can render
            hotels, flights, destinations,
            with options like
            pick-one (exactly one)
            pick-some (more than one)
            pick-one-per-traveler
            pick-some-per-traveler
    
    
        
        TOP LAYER --> PRESENTATION : renders the application state with react (virtual dom)
            - pool of atomic and re-usable stateless components for corporate design ui elements ( buttons, dialogs, layouts )
            - controller-like components for workflow-steps ()
        
        MID LAYER --> DATA/STATE & COMMUNICATION : mobx, ibe-workflow-ts
            - state management (ts singletons with mobx power)
                gets
            - step and component registry (ibe-workflow-ts)
            - load and save state from backend (ibe-workflow-ts)
        
        BOTTOM LAYER -->  module-glue-ts
    
    */
    
}

export default GlueModuleInterface;