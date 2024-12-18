import utils from '@bigcommerce/stencil-utils';
import Swal from 'sweetalert2';
import './update-cart-qty';
import './add-to-cart-qty';

jest.mock('@bigcommerce/stencil-utils', () => ({
    api: {
        cart: {
            itemUpdate: jest.fn(),
        },
    },
}));

jest.mock('sweetalert2', () => ({
    fire: jest.fn(() => Promise.resolve()),
}));

const delayPromise = async (ms = 50) => {
    await Alpine.nextTick();
    await new Promise((resolve) => setTimeout(resolve, ms));
};

describe('serenityUpdateCartQty', () => {
    beforeAll(() => {
        Alpine.start();
    });

    beforeEach(async () => {
        document.body.innerHTML = `
            <div x-data="serenityAddToCartQty">
                <div x-data="serenityUpdateCartQty({ itemId: '12345' })"></div>
            </div>
        `;
        Alpine.initTree(document.body);
        await delayPromise();
    });

    afterEach(async () => {
        Alpine.destroyTree(document.body);
        jest.clearAllMocks();
        await Alpine.nextTick();
    });

    test('should initialize and find parent component with qty', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data="serenityUpdateCartQty({ itemId: \'12345\' })"]'));
        expect(componentInstance.qty).toBe(1);  // Check initial quantity from parent component
    });

    test('should throw error if parent component is not found', async () => {
        document.body.innerHTML = `
        <div x-data="serenityUpdateCartQty({ itemId: '12345' })"></div>
    `; // No parent with x-data="serenityAddToCartQty"

        let errorMessage = undefined;
        const errorHandler = (event) => {
            errorMessage = event.message;
            event.preventDefault();
        };
        window.addEventListener('error', errorHandler);

        Alpine.initTree(document.body);
        await delayPromise();

        window.removeEventListener('error', errorHandler);

        expect(errorMessage).toBe('Parent element with x-data=\'serenityAddToCartQty\' not found.');
    });

    test('should update cart quantity and trigger cart update event on successful update', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data="serenityUpdateCartQty({ itemId: \'12345\' })"]'));
        const mockResponse = { data: { status: 'succeed' } };
        utils.api.cart.itemUpdate.mockImplementation((itemId, qty, callback) => {
            callback(null, mockResponse);
        });

        delete window.location;
        window.location = { reload: jest.fn() };
        const eventSpy = jest.spyOn(window, 'dispatchEvent');

        // Simulate qty change in parent component
        componentInstance.qty = 2;
        await delayPromise(1000); // Debounce timeout is 750ms

        // Check that the item update API was called with the correct itemId and qty
        expect(utils.api.cart.itemUpdate).toHaveBeenCalledWith('12345', 2, expect.any(Function));

        // Check that the "serenityCartUpdate" event was dispatched
        expect(eventSpy).toHaveBeenCalledWith(expect.objectContaining({ type: 'serenityCartUpdate' }));

        // Check that the page reload is triggered
        expect(window.location.reload).toHaveBeenCalled();
    });

    test('should show error Swal if item update fails with error response', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data="serenityUpdateCartQty({ itemId: \'12345\' })"]'));
        const mockError = new Error('Failed to update item quantity');
        utils.api.cart.itemUpdate.mockImplementation((itemId, qty, callback) => {
            callback(mockError, null);
        });

        componentInstance.qty = 2;  // Trigger watcher
        await delayPromise(1000); // Debounce timeout is 750ms

        // Check that Swal.fire was called with the error message
        expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
            title: 'Failed to update item quantity',
            icon: 'error',
        }));
    });

    test('should show error Swal if item update response contains errors', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data="serenityUpdateCartQty({ itemId: \'12345\' })"]'));
        const mockResponse = {
            data: {
                status: 'fail',
                errors: ['Quantity unavailable', 'Invalid request'],
            },
        };
        utils.api.cart.itemUpdate.mockImplementation((itemId, qty, callback) => {
            callback(null, mockResponse);
        });

        // Simulate qty change in parent component
        componentInstance.qty = 3;  // Trigger watcher
        await delayPromise(1000); // Debounce timeout is 750ms

        // Check that Swal.fire was called with the response errors
        expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
            title: 'Quantity unavailable\nInvalid request',
            icon: 'error',
        }));
    });
});
