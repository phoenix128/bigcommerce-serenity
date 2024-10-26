import Alpine from 'alpinejs';
import './compare';

const delayPromise = async (ms = 50) => {
    await Alpine.nextTick();
    await new Promise((resolve) => setTimeout(resolve, ms));
};


describe('serenityCompare', () => {
    beforeAll(() => {
        Alpine.start();
    });

    beforeEach(() => {
        document.body.innerHTML = `
            <div x-data="serenityCompare({ compareUrl: '/compare' })">
                <span x-bind="compareCounter"></span>
                <a x-bind="compareLink">Compare</a>
            </div>
        `;
        Alpine.initTree(document.body);
    });

    afterEach(async () => {
        Alpine.destroyTree(document.body);
        await Alpine.nextTick();
    });

    test('should initialize with zero productsCount', () => {
        const counter = document.querySelector('span');
        expect(counter.textContent).toBe('0');
    });

    test('should update productsCount and URL when a product is added', async () => {
        const compareComponent = Alpine.$data(document.querySelector('[x-data]'));
        const counter = document.querySelector('span');
        const link = document.querySelector('a');

        compareComponent.addProduct('123');
        await delayPromise();
        expect(counter.textContent).toBe('1');
        expect(link.getAttribute('href')).toBe('/compare/123');

        compareComponent.addProduct('456');
        await delayPromise();
        expect(counter.textContent).toBe('2');
        expect(link.getAttribute('href')).toBe('/compare/123/456');
    });

    test('should not add a product if it already exists in the list', async () => {
        const compareComponent = Alpine.$data(document.querySelector('[x-data]'));

        compareComponent.addProduct('123');
        compareComponent.addProduct('123');
        await delayPromise();

        expect(compareComponent.productIds.length).toBe(1);
    });

    test('should update productsCount and URL when a product is removed', async () => {
        const compareComponent = Alpine.$data(document.querySelector('[x-data]'));
        const counter = document.querySelector('span');
        const link = document.querySelector('a');

        compareComponent.addProduct('123');
        compareComponent.addProduct('456');
        compareComponent.removeProduct('123');
        await delayPromise();

        expect(counter.textContent).toBe('1');
        expect(link.getAttribute('href')).toBe('/compare/456');
    });

    test('should clear all products', async () => {
        const compareComponent = Alpine.$data(document.querySelector('[x-data]'));
        const counter = document.querySelector('span');
        const link = document.querySelector('a');

        compareComponent.addProduct('123');
        compareComponent.addProduct('456');
        compareComponent.clearProducts();
        await delayPromise();

        expect(counter.textContent).toBe('0');
        expect(link.getAttribute('href')).toBe('/compare/');
    });
});
