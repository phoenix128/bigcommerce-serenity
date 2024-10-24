import Alpine from 'alpinejs';
import mergeQs from '../utils/merge-qs';
import './facet';

jest.mock('../utils/merge-qs', () => jest.fn());

const delayPromise = async (ms = 50) => {
    await Alpine.nextTick();
    await new Promise((resolve) => setTimeout(resolve, ms));
};

describe('serenityFacets', () => {
    beforeAll(() => {
        Alpine.start();
    });

    beforeEach(() => {
        document.body.innerHTML = `
            <div x-data="serenityFacets()">
                <div id="product-listing"></div>
            </div>
        `;
        Alpine.initTree(document.body);
    });

    afterEach(async () => {
        Alpine.destroyTree(document.body);
        await Alpine.nextTick();
    });

    test('should throw an error if reloadProductListing method is missing', () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));

        expect(() => {
            componentInstance.applyFacets('/test-url');
        }).toThrow('reloadProductListing method is required');
    });

    test('should call reloadProductListing method when applyFacets is called', async () => {
        const mockReloadProductListing = jest.fn();
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));

        componentInstance.reloadProductListing = mockReloadProductListing;

        componentInstance.applyFacets('/test-url');
        await delayPromise();

        expect(mockReloadProductListing).toHaveBeenCalledWith('/test-url');
    });
});

describe('serenityFacetItem', () => {
    beforeAll(() => {
        Alpine.start();
    });

    beforeEach(() => {
        document.body.innerHTML = `
            <div x-data="serenityFacetItem({ url: '/facet-url' })">
                <a x-bind="button">Facet Item</a>
            </div>
        `;
        Alpine.initTree(document.body);
    });

    afterEach(async () => {
        Alpine.destroyTree(document.body);
        await Alpine.nextTick();
    });

    test('should call applyFacets and set isLoading when button is clicked', async () => {
        const mockApplyFacets = jest.fn();
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        componentInstance.applyFacets = mockApplyFacets;

        const button = document.querySelector('a');
        button.click();
        await delayPromise();

        expect(mockApplyFacets).toHaveBeenCalledWith('/facet-url');
        expect(componentInstance.isLoading).toBe(true);
    });
});

describe('serenityFacetForm', () => {
    beforeAll(() => {
        Alpine.start();
    });

    beforeEach(() => {
        document.body.innerHTML = `
            <div x-data="serenityFacetForm()">
                <form x-bind="form" x-ref="form">
                    <input name="test-input" value="test-value">
                </form>
                <button x-bind="button">Submit Facet</button>
            </div>
        `;
        Alpine.initTree(document.body);
    });

    afterEach(async () => {
        Alpine.destroyTree(document.body);
        await Alpine.nextTick();
    });

    test('should call mergeQs and applyFacets when form is submitted', async () => {
        const mockApplyFacets = jest.fn();
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        componentInstance.applyFacets = mockApplyFacets;

        mergeQs.mockImplementation(() => '/merged-url');

        const form = document.querySelector('form');
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        await delayPromise();

        expect(mergeQs).toHaveBeenCalledWith(window.location.href, expect.any(Object));
        expect(mockApplyFacets).toHaveBeenCalledWith('/merged-url');
        expect(componentInstance.isLoading).toBe(true);
    });
});
