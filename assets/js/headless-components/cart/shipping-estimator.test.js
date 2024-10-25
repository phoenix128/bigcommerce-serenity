import JustValidate from 'just-validate';
import utils from '@bigcommerce/stencil-utils';
import './shipping-estimator';

jest.mock('@bigcommerce/stencil-utils', () => ({
    api: {
        cart: {
            getShippingQuotes: jest.fn(),
            submitShippingQuote: jest.fn((quoteId, callback) => callback()),
        },
    },
}));

const delayPromise = async (ms = 50) => {
    await Alpine.nextTick();
    await new Promise((resolve) => setTimeout(resolve, ms));
};

describe('serenityShippingEstimator', () => {
    beforeAll(() => {
        Alpine.start();
        Alpine.store('context', {
            shippingCountryErrorMessage: 'shippingCountryErrorMessage',
            shippingProvinceErrorMessage: 'shippingProvinceErrorMessage'
        });
    });

    afterEach(async () => {
        Alpine.destroyTree(document.body);
        jest.clearAllMocks();
        await Alpine.nextTick();
    });

    test('should initialize and apply validation', async () => {
        document.body.innerHTML = `
            <div x-data="serenityShippingEstimator()">
                <form x-ref="shippingEstimatorForm">
                    <select name="shipping-country" required></select>
                    <select name="shipping-state" required></select>
                </form>
            </div>
        `;
        Alpine.store('context', {
            shippingCountryErrorMessage: 'Country is required',
            shippingProvinceErrorMessage: 'State is required',
        });
        Alpine.initTree(document.body);

        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));

        await delayPromise();

        // Check that the validator has been initialized
        expect(componentInstance.validator).toBeInstanceOf(JustValidate);
        expect(Object.keys(componentInstance.validator.fields).length).toBeGreaterThan(0);
    });

    test('should call getShippingQuotes on form submission', async () => {
        document.body.innerHTML = `
            <div x-data="serenityShippingEstimator()">
                <form x-bind="shippingEstimatorForm">
                    <select name="shipping-country" required>
                        <option value="1">Country 1</option>
                    </select>
                    <select name="shipping-state" required>
                        <option value="2">State 1</option>
                    </select>
                    <input name="shipping-city" value="City" />
                    <input name="shipping-zip" value="12345" />
                    <button type="submit">Get Quotes</button>
                </form>
            </div>
        `;
        Alpine.initTree(document.body);

        const mockResponse = { content: '<p>Shipping Quote Results</p>' };
        utils.api.cart.getShippingQuotes.mockImplementation((params, template, callback) => {
            callback(null, mockResponse);
        });

        const form = document.querySelector('form');
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));

        // Simulate form submission
        componentInstance.onSubmitForm();
        await delayPromise();

        // Check that getShippingQuotes is called with the correct parameters
        expect(utils.api.cart.getShippingQuotes).toHaveBeenCalledWith(
            {
                country_id: '1',
                state_id: '2',
                city: 'City',
                zip_code: '12345',
            },
            'cart/shipping-quotes',
            expect.any(Function)
        );

        // Check that shippingQuotesContent is set correctly
        expect(componentInstance.shippingQuotesContent).toBe(mockResponse.content);
    });

    test('should submit selected shipping quote and reload page', async () => {
        document.body.innerHTML = `
            <div x-data="serenityShippingEstimator()">
                <form x-bind="shippingEstimatorForm">
                    <select name="shipping-country" required>
                        <option value="1">Country 1</option>
                    </select>
                    <select name="shipping-state" required>
                        <option value="2">State 1</option>
                    </select>
                    <input name="shipping-city" value="City" />
                    <input name="shipping-zip" value="12345" />
                    <button type="submit">Get Quotes</button>
                </form>
                <form x-ref="shippingQuotesForm">
                    <input type="radio" x-model="shippingQuoteId" value="1" />
                    <input type="radio" x-model="shippingQuoteId" value="2" />
                </form>
            </div>
        `;
        Alpine.initTree(document.body);

        delete window.location;
        window.location = { reload: jest.fn() };

        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        componentInstance.shippingQuoteId = 1;
        componentInstance.onSubmitShippingQuotesForm();
        await delayPromise();

        expect(utils.api.cart.submitShippingQuote).toHaveBeenCalledWith(1, expect.any(Function));
        expect(window.location.reload).toHaveBeenCalled();
    });

    test('should reapply validation on country change', async () => {
        document.body.innerHTML = `
            <div x-data="serenityShippingEstimator()">
                <form x-ref="shippingEstimatorForm">
                    <select name="shipping-country" required></select>
                    <select name="shipping-state" required></select>
                </form>
            </div>
        `;
        Alpine.initTree(document.body);

        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));

        // Check that the validator has been initialized
        await delayPromise();
        expect(componentInstance.validator).toBeInstanceOf(JustValidate);

        const previousValidator = componentInstance.validator;

        // Trigger country change and reapply validation
        componentInstance.onCountryChange();
        await delayPromise();

        // Ensure a new validator instance is created after country change
        expect(componentInstance.validator).not.toBe(previousValidator);
        expect(componentInstance.validator).toBeInstanceOf(JustValidate);
    });

    test('should disable submit button and show loading state while submitting', async () => {
        document.body.innerHTML = `
            <div x-data="serenityShippingEstimator()">
                <form x-bind="shippingEstimatorForm">
                    <select name="shipping-country" required>
                        <option value="1">Country 1</option>
                    </select>
                    <select name="shipping-state" required>
                        <option value="2">State 1</option>
                    </select>
                    <input name="shipping-city" value="City" />
                    <input name="shipping-zip" value="12345" />
                    <button x-bind="shippingEstimatorSubmit" type="submit">Get Quotes</button>
                </form>
                <form x-bind="shippingQuotesForm">
                    <input type="radio" x-model="shippingQuoteId" value="1" />
                    <input type="radio" x-model="shippingQuoteId" value="2" />
                </form>
            </div>
        `;
        Alpine.initTree(document.body);
        await delayPromise();

        const button = document.querySelector('button');
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));

        // Initially, isSubmitting should be false, and button should be enabled
        expect(componentInstance.isSubmitting).toBe(false);
        expect(button.disabled).toBe(false);
        expect(button.classList.contains('cursor-progress')).toBe(false);

        // Simulate form submission
        componentInstance.isSubmitting = true;
        await delayPromise();

        // Check that the submit button is disabled and shows loading state
        expect(button.disabled).toBe(true);
        expect(button.classList.contains('cursor-progress')).toBe(true);
    });
});
