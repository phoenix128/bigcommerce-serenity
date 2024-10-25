import utils from '@bigcommerce/stencil-utils';
import './mini-cart';
import Alpine from 'alpinejs';
import persist from '@alpinejs/persist'; // Adjust the path to your component

jest.mock('@bigcommerce/stencil-utils', () => ({
    api: {
        cart: {
            getCartQuantity: jest.fn(),
            getContent: jest.fn(),
        },
    },
}));

const delayPromise = async (ms = 50) => {
    await Alpine.nextTick();
    await new Promise((resolve) => setTimeout(resolve, ms));
};

describe('serenityMiniCart', () => {
    beforeAll(() => {
        Alpine.start();
        Alpine.plugin(persist);
    });

    afterEach(async () => {
        Alpine.destroyTree(document.body);
        jest.clearAllMocks();
        await Alpine.nextTick();
    });

    test('should initialize and load products count from sessionStorage', async () => {
        sessionStorage.setItem('productsCount', '5');

        document.body.innerHTML = `
            <div x-data="serenityMiniCart()">
                <button x-bind="miniCartPreviewButton">Preview Cart</button>
                <div x-bind="miniCartPreviewWrapper">
                    <p id="productsCount" x-text="productsCount"></p>
                </div>
            </div>
        `;
        Alpine.initTree(document.body);
        await delayPromise();

        const productsCount = document.querySelector('#productsCount');
        expect(productsCount.innerHTML).toBe('5');
    });

    test('should update products count when cart quantity is updated', async () => {
        document.body.innerHTML = `
            <div x-data="serenityMiniCart()">
                <button x-bind="miniCartPreviewButton">Preview Cart</button>
                <div x-bind="miniCartPreviewWrapper">
                    <p id="productsCount" x-text="productsCount"></p>
                </div>
            </div>
        `;
        Alpine.initTree(document.body);

        const mockQty = 8;
        utils.api.cart.getCartQuantity.mockImplementation((options, callback) => {
            callback(null, mockQty);
        });

        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        componentInstance.updateCartQuantity();
        await delayPromise();

        const productsCount = document.querySelector('#productsCount');
        expect(productsCount.innerHTML).toBe('' + mockQty);
        expect(utils.api.cart.getCartQuantity).toHaveBeenCalled();
    });

    test('should open mini cart and load cart content', async () => {
        document.body.innerHTML = `
            <div x-data="serenityMiniCart()">
                <button x-bind="miniCartPreviewButton">Preview Cart</button>
                <div x-bind="miniCartPreviewWrapper" x-show="isMiniCartOpen">
                    <p x-text="cartContent"></p>
                </div>
            </div>
        `;
        Alpine.initTree(document.body);

        const mockContent = '<p>Cart Content</p>';
        utils.api.cart.getContent.mockImplementation((options, callback) => {
            callback(null, mockContent);
        });

        const button = document.querySelector('button');
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        button.click();
        await delayPromise();

        expect(componentInstance.isMiniCartOpen).toBe(true);
        expect(componentInstance.cartContent).toBe(mockContent);
        expect(utils.api.cart.getContent).toHaveBeenCalled();
    });

    test('should close mini cart and clear auto close timeout', async () => {
        document.body.innerHTML = `
            <div x-data="serenityMiniCart()">
                <button x-bind="miniCartPreviewButton">Preview Cart</button>
                <div x-bind="miniCartPreviewWrapper" x-show="isMiniCartOpen"></div>
            </div>
        `;
        Alpine.initTree(document.body);

        const button = document.querySelector('button');
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));

        button.click();
        await delayPromise();

        expect(componentInstance.isMiniCartOpen).toBe(true);

        componentInstance.close();
        await delayPromise();

        expect(componentInstance.isMiniCartOpen).toBe(false);
        expect(componentInstance.outsideMoveTimeout).toBeNull();
    });

    test('should auto-close mini cart after delay on mouseout', async () => {
        document.body.innerHTML = `
            <div x-data="serenityMiniCart({ autoCloseDelay: 500 })">
                <div x-bind="miniCartPreviewWrapper" x-show="isMiniCartOpen"></div>
            </div>
        `;
        Alpine.initTree(document.body);

        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));

        // Open mini cart
        componentInstance.open();
        expect(componentInstance.isMiniCartOpen).toBe(true);

        // Trigger mouse out event to start auto close
        componentInstance.startAutoCloseTimeout();
        await new Promise((resolve) => setTimeout(resolve, 600)); // Wait for auto-close delay + buffer

        expect(componentInstance.isMiniCartOpen).toBe(false);
    });

    test('should clear auto-close timeout when mouse hovers over mini cart', async () => {
        document.body.innerHTML = `
            <div x-data="serenityMiniCart()">
                <div x-bind="miniCartPreviewWrapper" x-show="isMiniCartOpen"></div>
            </div>
        `;
        Alpine.initTree(document.body);

        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));

        // Open mini cart and set auto-close timeout
        componentInstance.open();
        componentInstance.startAutoCloseTimeout();
        expect(componentInstance.outsideMoveTimeout).not.toBeNull();

        // Clear auto-close timeout on mouse hover
        componentInstance.clearAutoCloseTimeout();
        expect(componentInstance.outsideMoveTimeout).toBeNull();
    });

    test('should handle cart update events by updating products count and resetting cart content', async () => {
        document.body.innerHTML = `
            <div x-data="serenityMiniCart()">
                <p x-text="productsCount"></p>
            </div>
        `;
        Alpine.initTree(document.body);

        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        componentInstance.productsCount = null;
        const mockQty = 10;

        utils.api.cart.getCartQuantity.mockImplementation((options, callback) => {
            callback(null, mockQty);
        });

        // Dispatch cart update event
        window.dispatchEvent(new CustomEvent('serenityCartUpdate'));
        await delayPromise();

        expect(componentInstance.productsCount).toBe(mockQty);
        expect(componentInstance.cartContent).toBe(null);
    });
});
