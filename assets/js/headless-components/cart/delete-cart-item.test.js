import utils from '@bigcommerce/stencil-utils';
import Swal from 'sweetalert2';
import './delete-cart-item';

jest.mock('@bigcommerce/stencil-utils', () => ({
    api: {
        cart: {
            itemRemove: jest.fn(),
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

describe('serenityDeleteCartItem', () => {
    beforeAll(() => {
        Alpine.start();
    });

    beforeEach(() => {
        document.body.innerHTML = `
            <div x-data="serenityDeleteCartItem({ itemId: '12345' })">
                <button x-bind="deleteCartItemButton">Delete Item</button>
            </div>
        `;
        Alpine.initTree(document.body);
    });

    afterEach(async () => {
        Alpine.destroyTree(document.body);
        await Alpine.nextTick();
        jest.clearAllMocks();
    });

    test('should call itemRemove when the delete button is clicked', async () => {
        const button = document.querySelector('button');
        const mockResponse = { data: { status: 'succeed' } };
        utils.api.cart.itemRemove.mockImplementation((itemId, callback) => {
            callback(null, mockResponse);
        });

        button.click();
        await delayPromise();

        expect(utils.api.cart.itemRemove).toHaveBeenCalledWith('12345', expect.any(Function));
    });

    test('should reload the page and dispatch serenityCartUpdate on successful item removal', async () => {
        const button = document.querySelector('button');
        const mockResponse = { data: { status: 'succeed' } };
        utils.api.cart.itemRemove.mockImplementation((itemId, callback) => {
            callback(null, mockResponse);
        });

        delete window.location;
        window.location = { reload: jest.fn() };

        const eventSpy = jest.spyOn(window, 'dispatchEvent');
        
        button.click();
        await delayPromise();

        expect(window.location.reload).toHaveBeenCalled();
        expect(eventSpy).toHaveBeenCalledWith(expect.objectContaining({
            type: 'serenityCartUpdate'
        }));
    });

    test('should show error Swal if item removal fails', async () => {
        const mockError = new Error('Failed to remove item');
        utils.api.cart.itemRemove.mockImplementation((itemId, callback) => {
            callback(mockError, null);
        });

        const button = document.querySelector('button');
        button.click();
        await delayPromise();

        expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
            title: 'Failed to remove item',
            icon: 'error',
        }));
    });

    test('should show error Swal with message from response if removal fails with error response', async () => {
        const mockResponse = {
            data: {
                status: 'fail',
                errors: ['Unable to remove item', 'Cart update failed'],
            },
        };
        utils.api.cart.itemRemove.mockImplementation((itemId, callback) => {
            callback(null, mockResponse);
        });

        const button = document.querySelector('button');
        button.click();
        await delayPromise();

        expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
            title: 'Unable to remove item\nCart update failed',
            icon: 'error',
        }));
    });

    test('should set cartContentUpdating to true when itemRemove is called', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        const button = document.querySelector('button');
        const mockResponse = { data: { status: 'succeed' } };
        
        utils.api.cart.itemRemove.mockImplementation((itemId, callback) => {
            callback(null, mockResponse);
        });

        button.click();
        await delayPromise();

        expect(componentInstance.cartContentUpdating).toBe(true);
    });

    test('should set cartContentUpdating to false when removal fails', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        const button = document.querySelector('button');
        const mockError = new Error('Failed to remove item');
        
        utils.api.cart.itemRemove.mockImplementation((itemId, callback) => {
            callback(mockError, null);
        });

        button.click();
        await delayPromise();

        expect(componentInstance.cartContentUpdating).toBe(false);
    });
});
