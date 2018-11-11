const cache : { [ src : string ] : Promise<HTMLLinkElement | HTMLScriptElement> } = {};

export type unload = () => void;

export async function load( url : string | string[] ) : Promise<unload> {
    const urls = Array.isArray( url ) ? url : [ url ];
    
    const tags = await Promise.all( urls.map( addToCacheAndReturnPromise ) );
    
    const unload : unload = () => {
        tags.forEach( tag => tag.parentElement.removeChild( tag ) );
    };
    
    return unload;
}

function addToCacheAndReturnPromise( url : string ) {
    if ( !cache.hasOwnProperty( url ) ) {
        cache[ url ] = inject( url );
    }
    
    return cache[ url ];
}

function inject( url : string ) : Promise<HTMLLinkElement | HTMLScriptElement> {
    return new Promise( ( resolve, reject ) => {
        
        const ext = url.split( '.' ).pop().toLowerCase();
        
        if ( ext !== 'js' && ext !== 'css' ) {
            reject( 'File must have extension js or css.' );
        }
        
        const tag = ext === 'js' ? createScript( url ) : createLink( url );
        
        tag.addEventListener( 'load', () => resolve( tag ) );
        tag.addEventListener( 'error', () => reject( 'Error loading file.' ) );
        tag.addEventListener( 'abort', () => reject( 'File loading aborted.' ) );
        
        document.head.appendChild( tag );
    } );
}

function createLink( href : string ) {
    const link = document.createElement( 'link' );
    link.href  = href;
    link.rel   = 'stylesheet';
    link.type  = 'text/css';
    return link;
}

function createScript( src : string ) {
    const script = document.createElement( 'script' );
    script.src   = src;
    script.async = true;
    script.type  = 'text/javascript';
    return script;
}
