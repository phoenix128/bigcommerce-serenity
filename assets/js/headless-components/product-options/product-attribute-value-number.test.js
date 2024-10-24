import './product-attribute-value-number'

describe('serenityProductAttributeValueNumber', () => {
    beforeAll(() => {
        Alpine.start();
    });

    beforeEach(() => {
        document.body.innerHTML = `
            <div x-data="serenityProductAttributeValueNumber({ min: 1, max: 10, limit: 'range', integerOnly: true })">
                <input type="text" x-bind="attributeInput" />
            </div>
        `;

        Alpine.initTree(document.body);
    });

    afterEach(async () => {
        Alpine.destroyTree(document.body);
        await Alpine.nextTick();
    });

    test('should initialize with correct default values', () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));

        expect(componentInstance.min).toBe(1);
        expect(componentInstance.max).toBe(10);
        expect(componentInstance.limit).toBe('range');
        expect(componentInstance.integerOnly).toBe(true);
    });

    test('should validate integer values correctly', () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));

        expect(componentInstance.isValueValid(5)).toBe(true);
        expect(componentInstance.isValueValid(11)).toBe(false); // Exceeds max
        expect(componentInstance.isValueValid(0)).toBe(false); // Below min
        expect(componentInstance.isValueValid('5')).toBe(true);
        expect(componentInstance.isValueValid('abc')).toBe(false); // Invalid string
    });

    test('should limit value correctly on change', () => {
        const inputElement = document.querySelector('input');

        inputElement.value = '15'; // Exceeds max
        inputElement.dispatchEvent(new Event('change'));
        expect(inputElement.value).toBe('10'); // Should be limited to max

        inputElement.value = '-5'; // Below min
        inputElement.dispatchEvent(new Event('change'));
        expect(inputElement.value).toBe('1'); // Should be limited to min
    });

    test('should validate value on keyup', () => {
        const inputElement = document.querySelector('input');
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));

        inputElement.value = '5';
        inputElement.dispatchEvent(new KeyboardEvent('keyup'));
        expect(componentInstance.isValid).toBe(true);

        inputElement.value = 'abc'; // Invalid input
        inputElement.dispatchEvent(new KeyboardEvent('keyup'));
        expect(componentInstance.isValid).toBe(false);

        inputElement.value = '12'; // Exceeds max
        inputElement.dispatchEvent(new KeyboardEvent('keyup'));
        expect(componentInstance.isValid).toBe(false);
    });

    test('should handle float values if integerOnly is false', () => {
        document.body.innerHTML = `
            <div x-data="serenityProductAttributeValueNumber({ min: 1, max: 10, limit: 'range', integerOnly: false })">
                <input type="text" x-bind="attributeInput" />
            </div>
        `;
        Alpine.initTree(document.body);

        const inputElement = document.querySelector('input');
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));

        inputElement.value = '5.5'; // Valid float
        inputElement.dispatchEvent(new KeyboardEvent('keyup'));
        expect(componentInstance.isValid).toBe(true);

        inputElement.value = '11.5'; // Exceeds max
        inputElement.dispatchEvent(new Event('change'));
        expect(inputElement.value).toBe('10'); // Should be limited to max
    });
});
