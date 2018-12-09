import { createUniqueId } from '../../../src/Util/Dom';

const id        = createUniqueId( 'blah_' );
const innerHTML = 'oh this was changed';

export const rendered = '<p id="' + id + '"></p>';
export const started  = '<p id="' + id + '">' + innerHTML + '</p>';

export function start() {
    const blah     = document.getElementById( id );
    blah.innerHTML = innerHTML;
}

export function render() {
    return rendered;
}

export function stop() {

}