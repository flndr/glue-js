
export function isNonEmptyString( something : any ) : boolean {
    return typeof something === 'string' && something !== '';
}

export function isFunction( something : any ) : boolean {
    return typeof something === 'function';
}
