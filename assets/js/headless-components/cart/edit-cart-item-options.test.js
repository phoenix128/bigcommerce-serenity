import utils from '@bigcommerce/stencil-utils';
import Swal from 'sweetalert2';
import './edit-cart-item-options';
import '../product-options';
import Alpine from 'alpinejs';

jest.mock('@bigcommerce/stencil-utils', () => ({
    api: {
        productAttributes: {
            configureInCart: jest.fn(),
            optionChange: jest.fn(),
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

describe('serenityEditCartItemOptions', () => {
    let mockModal;

    beforeAll(() => {
        Alpine.start();
    });

    beforeEach(() => {
        // Mock the modal store
        mockModal = {
            openLoading: jest.fn(),
            openContent: jest.fn(),
            close: jest.fn(),
        };
        Alpine.store('serenityModal', mockModal);

        document.body.innerHTML = `
            <div x-data="serenityEditCartItemOptions({ itemId: '12345', productId: '67890' })">
                <button x-bind="editCartItemOptionsButton">Edit Options</button>
            </div>
        `;
        Alpine.initTree(document.body);
    });

    afterEach(async () => {
        Alpine.destroyTree(document.body);
        await Alpine.nextTick();
        jest.clearAllMocks();
    });

    test('should throw an error if serenityModal is not found', () => {
        Alpine.store('serenityModal', 0); // Remove the modal from the store

        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));

        expect(() => {
            componentInstance.getModal();
        }).toThrow('serenityModal not found');
    });

    test('should show error Swal and close modal on API error', async () => {
        const mockError = new Error('Failed to configure product');
        utils.api.productAttributes.configureInCart.mockImplementation((itemId, options, callback) => {
            callback(mockError, null);
        });

        const button = document.querySelector('button');
        button.click();
        await delayPromise();

        expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
            title: 'Failed to configure product',
            icon: 'error',
        }));
        expect(mockModal.close).toHaveBeenCalled();
    });

    test('should bind serenityProductOptions with correct productId on success', async () => {
        const mockResponse = { content: '<p>Configured product</p>' };
        utils.api.productAttributes.configureInCart.mockImplementation((itemId, options, callback) => {
            callback(null, mockResponse);
        });

        // Mock the serenityProductOptions component
        document.body.innerHTML += `<div x-data="serenityProductOptions"></div>`;
        Alpine.destroyTree(document.body);
        Alpine.initTree(document.body);
        Alpine.$data(document.querySelector('[x-data="serenityProductOptions"]')).productId = null;

        const button = document.querySelector('button');
        button.click();
        await delayPromise();

        const productOptionsInstance = Alpine.$data(document.querySelector('[x-data="serenityProductOptions"]'));
        expect(productOptionsInstance.productId).toBe('67890');
    });
});
