import utils from '@bigcommerce/stencil-utils';
import './quickview';

jest.mock('@bigcommerce/stencil-utils', () => ({
    api: {
        product: {
            getById: jest.fn(),
        },
    },
}));

const delayPromise = async (ms = 50) => {
    await Alpine.nextTick();
    await new Promise((resolve) => setTimeout(resolve, ms));
};

describe('serenityQuickView', () => {
    beforeAll(() => {
        Alpine.start();
    });

    beforeEach(() => {
        Alpine.store('serenityModal', {
            openLoading: jest.fn(),
            openContent: jest.fn(),
            close: jest.fn(),
        });

        document.body.innerHTML = `<button x-data="serenityQuickView({ id: '123' })">Quick View</button>`;
        Alpine.initTree(document.body);
    });

    afterEach(async () => {
        Alpine.destroyTree(document.body);
        await Alpine.nextTick();
    });

    test('should initialize with correct product ID', () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));

        expect(componentInstance.id).toBe('123');
    });

    test('should throw error if modal is not found', async () => {
        Alpine.store('serenityModal', 0);

        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));

        expect(() => componentInstance.getModal()).toThrow('Modal not found');
    });

    test('should call getById with correct product ID on open', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        componentInstance.open();

        expect(utils.api.product.getById).toHaveBeenCalledWith(
            '123',
            { template: 'products/quick-view' },
            expect.any(Function)
        );
    });

    test('should open loading modal when product is clicked', async () => {
        document.querySelector('[x-data]').click();
        await delayPromise();

        expect(Alpine.store('serenityModal').openLoading).toHaveBeenCalled();
    });

    test('should open content modal when product fetch is successful', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));

        const mockResponse = '<div>Product Quick View</div>';
        utils.api.product.getById.mockImplementation((id, options, callback) => {
            callback(null, mockResponse);
        });

        componentInstance.open();
        await delayPromise();

        expect(Alpine.store('serenityModal').openContent).toHaveBeenCalledWith(mockResponse);
    });

    test('should close modal if product fetch fails', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));

        const mockError = new Error('Product not found');
        utils.api.product.getById.mockImplementation((id, options, callback) => {
            callback(mockError, null);
        });

        componentInstance.open();
        await delayPromise();

        expect(Alpine.store('serenityModal').close).toHaveBeenCalled();
    });
});
