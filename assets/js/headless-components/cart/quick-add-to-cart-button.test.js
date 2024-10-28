import navigate from '../../utils/navigate';
import './quick-add-to-cart-button';

jest.mock('../../utils/navigate', () => jest.fn());

const delayPromise = async (ms = 50) => {
    await Alpine.nextTick();
    await new Promise((resolve) => setTimeout(resolve, ms));
};

describe('serenityQuickAddToCartButton', () => {
    beforeAll(() => {
        Alpine.start();
    });

    afterEach(async () => {
        Alpine.destroyTree(document.body);
        jest.clearAllMocks();
        await Alpine.nextTick();
    });

    test('should dispatch "serenityCartReset" event and navigate to addToCartUrl when clicked', async () => {
        document.body.innerHTML = `
            <div x-data="serenityQuickAddToCartButton({ productId: '12345', addToCartUrl: '/custom-cart-url' })">
                <a x-bind="addToCartButton">Add to Cart</a>
            </div>
        `;
        Alpine.initTree(document.body);

        const button = document.querySelector('a');
        const eventSpy = jest.spyOn(window, 'dispatchEvent');

        button.click();
        await delayPromise();

        // Check that the "serenityCartReset" event is dispatched
        expect(eventSpy).toHaveBeenCalledWith(expect.objectContaining({ type: 'serenityCartReset' }));

        // Check that navigate is called with the custom URL
        expect(navigate).toHaveBeenCalledWith('/custom-cart-url');
    });

    test('should navigate to default add-to-cart URL when addToCartUrl is not provided', async () => {
        document.body.innerHTML = `
            <div x-data="serenityQuickAddToCartButton({ productId: '12345' })">
                <a x-bind="addToCartButton">Add to Cart</a>
            </div>
        `;
        Alpine.initTree(document.body);

        const button = document.querySelector('a');
        button.click();
        await delayPromise();

        // Check that navigate is called with the default URL using productId
        expect(navigate).toHaveBeenCalledWith('/cart.php?action=add&product_id=12345');
    });

    test('should set isAddingToCart to true and apply loading styles when clicked', async () => {
        document.body.innerHTML = `
            <div x-data="serenityQuickAddToCartButton({ productId: '12345' })">
                <a x-bind="addToCartButton">Add to Cart</a>
            </div>
        `;
        Alpine.initTree(document.body);

        const button = document.querySelector('a');
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));

        // Initially, isAddingToCart should be false
        expect(componentInstance.isAddingToCart).toBe(false);
        expect(button.classList.contains('cursor-progress')).toBe(false);

        // Simulate button click
        button.click();
        await delayPromise();

        // Check that isAddingToCart is true and button styles are updated
        expect(componentInstance.isAddingToCart).toBe(true);
        expect(button.classList.contains('cursor-progress')).toBe(true);
    });
});
