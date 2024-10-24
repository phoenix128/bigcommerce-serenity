import utils from '@bigcommerce/stencil-utils';
import Swal from 'sweetalert2';
import './add-coupon-form';

jest.mock('@bigcommerce/stencil-utils', () => ({
    api: {
        cart: {
            applyCode: jest.fn(),
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

describe('serenityAddCouponForm', () => {
    beforeAll(() => {
        Alpine.start();
    });

    beforeEach(() => {
        document.body.innerHTML = `
            <div x-data="serenityAddCouponForm()">
                <form x-bind="addCouponForm">
                    <input x-bind="couponCodeInput" x-ref="couponCodeInput">
                    <button x-bind="couponCodeSubmitButton">Apply Coupon</button>
                </form>
                <button x-bind="addCouponToggleButton">Toggle Form</button>
            </div>
        `;
        Alpine.initTree(document.body);
    });

    afterEach(async () => {
        Alpine.destroyTree(document.body);
        await Alpine.nextTick();
    });

    test('should toggle the form visibility when the toggle button is clicked', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        const toggleButton = document.querySelector('button[x-bind="addCouponToggleButton"]');
        
        expect(componentInstance.isOpen).toBe(false);

        toggleButton.click();
        await delayPromise();

        expect(componentInstance.isOpen).toBe(true);

        toggleButton.click();
        await delayPromise();

        expect(componentInstance.isOpen).toBe(false);
    });

    test('should disable inputs and show loading state during form submission', async () => {
        const mockResponse = { data: { status: 'success' } };
        utils.api.cart.applyCode.mockImplementation((code, callback) => {
            callback(null, mockResponse);
        });

        const couponCodeInput = document.querySelector('input[x-ref="couponCodeInput"]');
        const submitButton = document.querySelector('button[x-bind="couponCodeSubmitButton"]');
        const form = document.querySelector('form[x-bind="addCouponForm"]');
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));

        couponCodeInput.value = 'TESTCODE';
        componentInstance.couponCode = 'TESTCODE';
        
        form.dispatchEvent(new Event('submit'));
        await delayPromise();

        expect(componentInstance.isSubmitting).toBe(true);
        expect(couponCodeInput.disabled).toBe(true);
        expect(submitButton.disabled).toBe(true);
    });

    test('should reload the page on successful coupon submission', async () => {
        const mockResponse = { data: { status: 'success' } };
        utils.api.cart.applyCode.mockImplementation((code, callback) => {
            callback(null, mockResponse);
        });

        delete window.location;
        window.location = { reload: jest.fn() };

        const form = document.querySelector('form[x-bind="addCouponForm"]');
        form.dispatchEvent(new Event('submit'));
        await delayPromise();

        expect(window.location.reload).toHaveBeenCalled();
    });

    test('should display an error if coupon submission fails', async () => {
        const mockError = new Error('Invalid coupon code');
        utils.api.cart.applyCode.mockImplementation((code, callback) => {
            callback(mockError, null);
        });

        const form = document.querySelector('form[x-bind="addCouponForm"]');
        form.dispatchEvent(new Event('submit'));
        await delayPromise();

        expect(Swal.fire).toHaveBeenCalled();
    });

    test('should display validation errors if submission is unsuccessful', async () => {
        const mockResponse = {
            data: {
                status: 'error',
                errors: ['Coupon not valid', 'Code expired'],
            },
        };
        utils.api.cart.applyCode.mockImplementation((code, callback) => {
            callback(null, mockResponse);
        });

        const form = document.querySelector('form[x-bind="addCouponForm"]');
        form.dispatchEvent(new Event('submit'));
        await delayPromise();

        expect(Swal.fire).toHaveBeenCalled();
    });
});
