import './add-to-cart-button'

const delayPromise = async (ms = 50) => {
    await Alpine.nextTick();
    await new Promise((resolve) => setTimeout(resolve, ms));
};

describe('serenityAddToCartButton', () => {
    beforeAll(() => {
        Alpine.start();

    });

    beforeEach(() => {
        document.body.innerHTML = `
            <html>
                <body>
                    <input type="button" x-data="serenityAddToCartButton({
                        strings: {
                            default: 'Add to Cart',
                            adding: 'Adding...',
                            added: 'Added!'
                        }
                    })" />
                </body>
            </html>
        `;

        Alpine.initTree(document.body);
    });

    afterEach(async () => {
        Alpine.destroyTree(document.body);
        await Alpine.nextTick();
    });

    setupButton = async (canBuy = true) => {
        const button = document.querySelector('[type=button]');
        const componentInstance = Alpine.$data(button);

        componentInstance.addToCart = jest.fn();
        componentInstance.canBuy = canBuy;

        await delayPromise();

        return {
            button,
            componentInstance,
            addToCart: componentInstance.addToCart,
        }
    };

    test('should call addToCart method when button is clicked', async () => {
        const {addToCart, button} = await setupButton();

        button.click();
        await delayPromise();

        expect(addToCart).toHaveBeenCalled();
    });

    test('button should be enabled if canBuy is true', async () => {
        const {button} = await setupButton();
        expect(button.disabled).toBe(false);
    });

    test('button should be disabled if canBuy is false', async () => {
        const {button} = await setupButton(false);
        expect(button.disabled).toBe(true);
    });

    test ('should use the default string when component is started', async () => {
        const {button} = await setupButton();
        expect(button.value).toBe('Add to Cart');
    });
        

    test('should update to "Adding..." when added event is dispatched', async () => {
        const {button} = await setupButton();

        // Simulate adding event
        button.dispatchEvent(new CustomEvent('serenityAddToCartForm', {
            detail: { code: 'adding' },
            bubbles: true,
        }));
        await delayPromise();
        expect(button.value).toBe('Adding...');
        expect(button.disabled).toBe(true);
    });

    test('should update to "Added!" when added event is dispatched', async () => {
        const {button} = await setupButton();

        button.dispatchEvent(new CustomEvent('serenityAddToCartForm', {
            detail: { code: 'adding' },
            bubbles: true,
        }));
        await delayPromise();
        button.dispatchEvent(new CustomEvent('serenityAddToCartForm', {
            detail: { code: 'added' },
            bubbles: true,
        }));
        await delayPromise();
        expect(button.value).toBe('Added!');
        expect(button.disabled).toBe(true);
    });

    test('should reset to default text after "Added!" state', async () => {
        const {button} = await setupButton();

        // Simulate added event
        button.dispatchEvent(new CustomEvent('serenityAddToCartForm', {
            detail: { code: 'added' },
            bubbles: true,
        }));
        await delayPromise();

        // Wait for reset to default state
        await delayPromise(1000);
        expect(button.value).toBe('Add to Cart');
        expect(button.disabled).toBe(false);
    });

    test('should handle error event and reset to default text', async () => {
        const {button} = await setupButton();

        // Simulate error event
        button.dispatchEvent(new CustomEvent('serenityAddToCartForm', {
            detail: { code: 'error' },
            bubbles: true,
        }));
        await delayPromise();

        expect(button.value).toBe('Add to Cart');
        expect(button.disabled).toBe(false);
    });

    test('should set denied pointer cursor when adding and revert when added', async () => {
        const {button} = await setupButton();
        expect(button.className).toBe('cursor-pointer');

        button.dispatchEvent(new CustomEvent('serenityAddToCartForm', {
            detail: { code: 'adding' },
            bubbles: true,
        }));
        await delayPromise();
        expect(button.className).toBe('cursor-progress animate-pulse');

        button.dispatchEvent(new CustomEvent('serenityAddToCartForm', {
            detail: { code: 'added' },
            bubbles: true,
        }));
        await delayPromise(1100);
        expect(button.className).toBe('cursor-pointer');
    });
});
