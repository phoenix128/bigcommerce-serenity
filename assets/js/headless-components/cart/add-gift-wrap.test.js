import utils from '@bigcommerce/stencil-utils';
import './add-gift-wrap';

jest.mock('@bigcommerce/stencil-utils', () => ({
    api: {
        cart: {
            getItemGiftWrappingOptions: jest.fn(),
        },
    },
}));

const delayPromise = async (ms = 50) => {
    await Alpine.nextTick();
    await new Promise((resolve) => setTimeout(resolve, ms));
};

describe('serenityAddGiftWrap', () => {
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
            <div x-data="serenityAddGiftWrap({ itemId: '12345' })">
                <button x-bind="el">Add Gift Wrap</button>
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
        Alpine.store('serenityModal', 0);

        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));

        let error;
        try {
            componentInstance.getModal();
        } catch(e) {
            error = e;
        }

        expect(error?.message).toBe('serenityModal not found');
    });

    test('should open the modal with loading state when the button is clicked', async () => {
        const button = document.querySelector('button');
        button.click();
        await delayPromise();

        expect(mockModal.openLoading).toHaveBeenCalled();
        expect(utils.api.cart.getItemGiftWrappingOptions).toHaveBeenCalledWith(
            '12345',
            { template: 'cart/modals/gift-wrapping-form' },
            expect.any(Function)
        );
    });

    test('should open the modal with content when gift wrapping options are fetched successfully', async () => {
        const mockResponse = { content: '<p>Gift Wrapping Options</p>' };
        utils.api.cart.getItemGiftWrappingOptions.mockImplementation((itemId, options, callback) => {
            callback(null, mockResponse);
        });

        const button = document.querySelector('button');
        button.click();
        await delayPromise();

        expect(mockModal.openContent).toHaveBeenCalledWith('<p>Gift Wrapping Options</p>', true);
    });

    test('should close the modal if an error occurs while fetching gift wrapping options', async () => {
        const mockError = new Error('Failed to load gift wrapping options');
        utils.api.cart.getItemGiftWrappingOptions.mockImplementation((itemId, options, callback) => {
            callback(mockError, null);
        });

        const button = document.querySelector('button');
        button.click();
        await delayPromise();

        expect(mockModal.close).toHaveBeenCalled();
    });

    test('should not open modal if itemId is missing', async () => {
        document.body.innerHTML = `
            <div x-data="serenityAddGiftWrap({ itemId: '' })">
                <button x-bind="el">Add Gift Wrap</button>
            </div>
        `;
        Alpine.initTree(document.body);

        const button = document.querySelector('button');
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));

        button.click();
        await delayPromise();

        expect(mockModal.openLoading).not.toHaveBeenCalled();
        expect(utils.api.cart.getItemGiftWrappingOptions).not.toHaveBeenCalled();
    });
});
