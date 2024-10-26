import Alpine from 'alpinejs';
import './add-to-compare';

const delayPromise = async (ms = 50) => {
    await Alpine.nextTick();
    await new Promise((resolve) => setTimeout(resolve, ms));
};

describe('serenityAddToCompare', () => {
    beforeAll(() => {
        Alpine.start();
    });

    beforeEach(() => {
        document.body.innerHTML = `
            <div x-data="serenityAddToCompare({ productId: '12345' })">
                <a x-bind="addToCompareButton">Add to Compare</a>
            </div>
        `;
        Alpine.store('compareProducts', {
            products: [],
            addProduct(productId) {
                this.products.push(productId);
            },
        });
        Alpine.initTree(document.body);
    });

    afterEach(async () => {
        Alpine.destroyTree(document.body);
        await Alpine.nextTick();
    });

    test('should throw error if productId is not provided', async () => {
        document.body.innerHTML = `<div x-data="serenityAddToCompare()"><a x-bind="addToCompareButton">Add to Compare</a></div>`;

        let errorMessage = undefined;
        const errorHandler = (event) => {
            errorMessage = event.message;
            event.preventDefault();
        };
        window.addEventListener('error', errorHandler);

        Alpine.initTree(document.body);

        const button = document.querySelector('a');
        button.click();

        await delayPromise();

        window.removeEventListener('error', errorHandler);

        expect(errorMessage).toBe('Product ID is required');
    });

    test('should add product to compare when clicked', () => {
        const button = document.querySelector('a');
        button.click();

        const compareStore = Alpine.store('compareProducts');
        expect(compareStore.products).toContain('12345');
    });
});
