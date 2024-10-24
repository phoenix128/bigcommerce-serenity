import './product-information';

describe('serenityProductInformation', () => {
    beforeAll(() => {
        Alpine.start();
    });

    beforeEach(() => {
        document.body.innerHTML = `
            <div x-data="serenityProductInformation({ product: { name: 'Sample Product', id: 1 } })">
                <div>Product Info</div>
            </div>
        `;

        Alpine.initTree(document.body);
    });

    afterEach(async () => {
        Alpine.destroyTree(document.body);
        await Alpine.nextTick();
    });

    test('should initialize with correct product information', () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));

        expect(componentInstance.product).toEqual({ name: 'Sample Product', id: 1 });
    });

    test('should update product information on "serenityProductOptions.window" event', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        const newProductData = { name: 'Updated Product', price: '$100' };

        const event = new CustomEvent('serenityProductOptions', {
            detail: {
                code: 'update',
                data: newProductData,
                productId: 1
            },
            bubbles: true,
        });

        document.querySelector('[x-data]').dispatchEvent(event);
        await Alpine.nextTick();

        expect(componentInstance.product).toEqual({
            id: 1,
            ...newProductData
        });
    });

    test('should ignore "serenityProductOptions.window" event if product ID does not match', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        const newProductData = { name: 'Updated Product', price: '$100' };

        const event = new CustomEvent('serenityProductOptions', {
            detail: {
                code: 'update',
                data: newProductData,
                productId: 2
            },
            bubbles: true,
        });

        document.querySelector('[x-data]').dispatchEvent(event);
        await Alpine.nextTick();

        expect(componentInstance.product).toEqual({ name: 'Sample Product', id: 1 });
    });

    test('should ignore "serenityProductOptions.window" event if product ID is not provided', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        const newProductData = { name: 'Updated Product', price: '$100' };

        const event = new CustomEvent('serenityProductOptions', {
            detail: {
                code: 'update',
                data: newProductData
            },
            bubbles: true,
        });

        document.querySelector('[x-data]').dispatchEvent(event);
        await Alpine.nextTick();

        expect(componentInstance.product).toEqual({ name: 'Sample Product', id: 1 });
    });

    test('should handle "serenityProductOptions.window" event even if product ID is not an integer', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        const newProductData = { name: 'Updated Product', price: '$100', id: '1' };

        const event = new CustomEvent('serenityProductOptions', {
            detail: {
                code: 'update',
                data: newProductData,
                productId: 1
            },
            bubbles: true,
        });

        document.querySelector('[x-data]').dispatchEvent(event);
        await Alpine.nextTick();

        expect(componentInstance.product).toEqual({
            id: 1,
            ...newProductData
        });
    });
});
