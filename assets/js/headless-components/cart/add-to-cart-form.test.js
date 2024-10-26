import utils from '@bigcommerce/stencil-utils';
import Swal from 'sweetalert2';
import navigate from '../../utils/navigate';
import './add-to-cart-form';

jest.mock('@bigcommerce/stencil-utils', () => ({
    api: {
        cart: {
            itemAdd: jest.fn(),
        },
    },
}));

jest.mock('sweetalert2', () => ({
    fire: jest.fn(() => Promise.resolve({ isConfirmed: true })),
}));

jest.mock('../../utils/navigate', () => jest.fn());

jest.mock('../../utils/api', () => ({
    normalizeFormData: jest.fn(),
}));

const delayPromise = async (ms = 50) => {
    await Alpine.nextTick();
    await new Promise((resolve) => setTimeout(resolve, ms));
};

describe('serenityAddToCartForm', () => {
    beforeAll(() => {
        Alpine.start();
    });

    beforeEach(() => {
        document.body.innerHTML = `
            <form x-data="serenityAddToCartForm({ canBuy: true, canPurchase: true, purchasingMessageText: '' })">
                <div x-bind="purchasingMessage">Out of Stock</div>
            </form>
        `;
        Alpine.initTree(document.body);
    });

    afterEach(async () => {
        Alpine.destroyTree(document.body);
        await Alpine.nextTick();
        jest.clearAllMocks();
    });

    test('should update canBuy and purchasingMessageText on product options update', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));

        const productOptionsEvent = new CustomEvent('serenityProductOptions', {
            detail: {
                code: 'update',
                data: {
                    purchasable: false,
                    instock: false,
                    purchasing_message: 'Out of stock',
                },
            },
        });

        window.dispatchEvent(productOptionsEvent);
        await delayPromise();

        expect(componentInstance.canBuy).toBe(false);
        expect(componentInstance.purchasingMessageText).toBe('Out of stock');
    });

    test('should emit the "adding" event when addToCart is called', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        const eventSpy = jest.fn();

        window.addEventListener('serenityAddToCartForm', eventSpy);

        componentInstance.addToCart();
        await delayPromise();

        expect(eventSpy).toHaveBeenCalledWith(expect.objectContaining({
            detail: {
                code: 'adding',
                data: componentInstance,
                form: componentInstance.addToCartForm,
            },
        }));
    });

    test('should call itemAdd and display success Swal on successful add to cart', async () => {
        const mockResponse = { data: 'success' };
        utils.api.cart.itemAdd.mockImplementation((formData, callback) => {
            callback(null, mockResponse);
        });

        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        componentInstance.addToCart();
        await delayPromise();

        expect(utils.api.cart.itemAdd).toHaveBeenCalled();
        expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: 'success' }));
    });

    test('should navigate to cart when Swal confirm button is clicked', async () => {
        Swal.fire.mockImplementation(() => Promise.resolve({ isConfirmed: true }));

        const mockResponse = { data: 'success' };
        utils.api.cart.itemAdd.mockImplementation((formData, callback) => {
            callback(null, mockResponse);
        });

        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        componentInstance.addToCart();
        await delayPromise();

        expect(navigate).toHaveBeenCalledWith('/cart.php');
    });

    test('should show error Swal on failed add to cart', async () => {
        const mockError = new Error('Failed to add to cart');
        utils.api.cart.itemAdd.mockImplementation((formData, callback) => {
            callback(mockError, null);
        });

        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        componentInstance.addToCart();
        await delayPromise();

        expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
            icon: 'error',
            title: mockError.message,
        }));
    });

    test('should not add to cart if cannot purchase', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        componentInstance.canPurchase = false;

        const eventSpy = jest.fn();
        window.addEventListener('serenityAddToCartForm', eventSpy);

        componentInstance.addToCart();

        expect(eventSpy).not.toHaveBeenCalledWith(expect.objectContaining({
            detail: {
                code: 'adding',
                data: componentInstance,
                form: componentInstance.addToCartForm,
            },
        }));

        expect(utils.api.cart.itemAdd).not.toHaveBeenCalled();
    });
});
