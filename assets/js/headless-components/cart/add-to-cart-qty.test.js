import './add-to-cart-qty';

const delayPromise = async (ms = 50) => {
    await Alpine.nextTick();
    await new Promise((resolve) => setTimeout(resolve, ms));
};

describe('serenityAddToCartQty', () => {
    beforeAll(() => {
        Alpine.start();
    });

    beforeEach(() => {
        document.body.innerHTML = `
            <html>
                <body>
                    <div x-data="serenityAddToCartQty({ min: 1, max: 5 })">
                        <button x-bind="decrease">-</button>
                        <input x-bind="input" x-ref="input" />
                        <button x-bind="increase">+</button>
                    </div>
                </body>
            </html>
        `;

        Alpine.initTree(document.body);
    });

    afterEach(async () => {
        Alpine.destroyTree(document.body);
        await Alpine.nextTick();
    });

    test('initial quantity should be set to min value', () => {
        const inputElement = document.querySelector('[x-ref="input"]');
        expect(Number(inputElement.value)).toBe(1);
    });

    test('should increase quantity when increase button is clicked', async () => {
        const increaseButton = document.querySelector('[x-bind="increase"]');
        const inputElement = document.querySelector('[x-ref="input"]');

        increaseButton.click();
        await delayPromise();

        expect(Number(inputElement.value)).toBe(2);
    });

    test('should decrease quantity when decrease button is clicked', async () => {
        const increaseButton = document.querySelector('[x-bind="increase"]');
        const decreaseButton = document.querySelector('[x-bind="decrease"]');
        const inputElement = document.querySelector('[x-ref="input"]');

        increaseButton.click();
        await delayPromise();
        expect(Number(inputElement.value)).toBe(2);

        decreaseButton.click();
        await delayPromise();
        expect(Number(inputElement.value)).toBe(1);
    });

    test('should not decrease below minimum value', async () => {
        const decreaseButton = document.querySelector('[x-bind="decrease"]');
        const inputElement = document.querySelector('[x-ref="input"]');

        decreaseButton.click();
        await delayPromise();

        expect(Number(inputElement.value)).toBe(1);
        expect(decreaseButton.disabled).toBe(true);
    });

    test('should not increase above maximum value', async () => {
        const increaseButton = document.querySelector('[x-bind="increase"]');
        const inputElement = document.querySelector('[x-ref="input"]');

        // Increment until reaching max
        for (let i = 1; i <= 4; i++) {
            increaseButton.click();
            await delayPromise();
        }

        expect(Number(inputElement.value)).toBe(5);
        expect(increaseButton.disabled).toBe(true);
    });

    test('should disable increase button when quantity is at max', async () => {
        const increaseButton = document.querySelector('[x-bind="increase"]');
        const inputElement = document.querySelector('[x-ref="input"]');

        // Increment until reaching max
        for (let i = 1; i <= 4; i++) {
            increaseButton.click();
            await delayPromise();
        }

        expect(Number(inputElement.value)).toBe(5);
        expect(increaseButton.disabled).toBe(true);
    });

    test('should disable decrease button when quantity is at min', async () => {
        const decreaseButton = document.querySelector('[x-bind="decrease"]');
        const inputElement = document.querySelector('[x-ref="input"]');

        decreaseButton.click();
        await delayPromise();

        expect(Number(inputElement.value)).toBe(1);
        expect(decreaseButton.disabled).toBe(true);
    });

    test('should work when numbers are input manually', async () => {
        const inputElement = document.querySelector('[x-ref="input"]');
        const increaseButton = document.querySelector('[x-bind="increase"]');
        const decreaseButton = document.querySelector('[x-bind="decrease"]');

        inputElement.value = 3;
        inputElement.dispatchEvent(new Event('input'));
        await delayPromise();

        expect(Number(inputElement.value)).toBe(3);
        expect(decreaseButton.disabled).toBe(false);
        expect(increaseButton.disabled).toBe(false);

        increaseButton.click();
        await delayPromise();

        expect(Number(inputElement.value)).toBe(4);
        expect(decreaseButton.disabled).toBe(false);
        expect(increaseButton.disabled).toBe(false);

        decreaseButton.click();
        await delayPromise();

        expect(Number(inputElement.value)).toBe(3);
        expect(decreaseButton.disabled).toBe(false);
        expect(increaseButton.disabled).toBe(false);
    });

    test('should not allow non-numeric input', async () => {
        const inputElement = document.querySelector('[x-ref="input"]');

        inputElement.value = 'abc';
        inputElement.dispatchEvent(new Event('input'));
        await delayPromise();

        expect(Number(inputElement.value)).toBe(1);
    });
});
