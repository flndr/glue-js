import GlueStepper from '../../src/Step/GlueStepper';
import { ISO_TEST_STEP_ONE, ISO_TEST_STEP_ONE_MARKUP } from './Mocks/ISO_TEST_STEP/ISO_TEST_STEP_ONE';
import { ISO_TEST_STEP_TWO, ISO_TEST_STEP_TWO_MARKUP } from './Mocks/ISO_TEST_STEP/ISO_TEST_STEP_TWO';


let worker : GlueStepper; // name it transition / laminate
const body : Element = document.getElementsByTagName( 'body' )[ 0 ];

describe( 'GlueStepper', () => {
    
    beforeEach( () => {
        worker = new GlueStepper( body );
    } );
    
    it( 'should be defined', () => {
        expect( typeof GlueStepper ).toBe( 'function' );
    } );
    
    describe( 'registerModule()', () => {
        
        it( 'should have a method to register modules', () => {
            expect( typeof worker.registerModule ).toBe( 'function' );
        } );
        
    } );
    
    describe( 'goto()', () => {
        
        it( 'should have a method to start or go to a step', () => {
            expect( typeof worker.goto ).toBe( 'function' );
        } );
        
        it( 'should have a method to stop current step', () => {
            expect( typeof worker.stop ).toBe( 'function' );
        } );
        
        it( 'should have a method to start or go to a step', async () => {
            worker.registerModule( 'ISO_TEST_STEP_ONE', ISO_TEST_STEP_ONE );
            worker.registerModule( 'ISO_TEST_STEP_TWO', ISO_TEST_STEP_TWO );
            await worker.goto( 'ISO_TEST_STEP_ONE' );
            expect( worker.getContainerElement().innerHTML ).toEqual( ISO_TEST_STEP_ONE_MARKUP );
            await worker.goto( 'ISO_TEST_STEP_TWO' );
            expect( worker.getContainerElement().innerHTML ).toEqual( ISO_TEST_STEP_TWO_MARKUP );
            await worker.goto( 'ISO_TEST_STEP_ONE' );
            expect( worker.getContainerElement().innerHTML ).toEqual( ISO_TEST_STEP_ONE_MARKUP );
            await worker.stop();
            expect( body.innerHTML ).toEqual( '' );
        } );
        
    } );
    
} );