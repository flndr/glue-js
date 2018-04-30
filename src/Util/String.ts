
export function replaceAll( search : string, replacement : string, target : string ) : string {
    return target.split( search ).join( replacement );
}

export function renderTemplate(
    template : string,
    templateVars : { [ key : string ] : string },
    placeholderPrefix : string = '{',
    placeholderSuffix : string = '}'
) : string {

    //if ( typeof template !== 'string' || template === '' ) {
    //    throw new Error( '"template" must be a non-empty string.' );
    //}
    //
    //if ( typeof templateVars !== 'object' || Object.keys( templateVars ).length === 0 ) {
    //    throw new Error( '"templateVars" must be a non-empty object.' );
    //}

    Object.keys( templateVars ).forEach( key => {
        let placeholder = placeholderPrefix + key + placeholderSuffix;
        let value       = templateVars[ key ];
        template        = replaceAll( placeholder, value, template );
    } );

    return template;
}
