import { api } from '@bigcommerce/stencil-utils';
import Swal from 'sweetalert2';
import './facet';

jest.mock('@bigcommerce/stencil-utils', () => ({
    api: {
        getPage: jest.fn(),
    },
}));

jest.mock('sweetalert2', () => ({
    fire: jest.fn(),
}));

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
            <div x-data="serenityFacets({ containerSelector: '#sidebar', listingSelector: '#product-listing', categoryProductsPerPage: 10 })">
                <div id="product-listing"></div>
                <div id="sidebar"></div>
            </div>
        `;
        Alpine.initTree(document.body);
    });

    afterEach(async () => {
        Alpine.destroyTree(document.body);
        await Alpine.nextTick();

        window.history.pushState({}, document.title, '/');
    });

    test('should update product listing and sidebar when applyFacets is called', async () => {
        const mockContent = {
            productListing: '<p>Product Listing Updated</p>',
            sidebar: '<p>Sidebar Updated</p>',
        };
        
        api.getPage.mockImplementation((url, options, callback) => {
            callback(null, mockContent);
        });

        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        componentInstance.applyFacets('/new-url');
        await delayPromise();

        expect(document.querySelector('#product-listing').innerHTML).toBe(mockContent.productListing);
        expect(document.querySelector('#sidebar').innerHTML).toBe(mockContent.sidebar);
    });

    test('should show an error when api.getPage returns an error', async () => {
        const mockError = async () => new Error('An error occurred');
        api.getPage.mockImplementation((url, options, callback) => {
            callback(mockError, null);
        });

        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));

        expect(() => componentInstance.applyFacets('/bad-url')).toThrow('An error occurred');
        expect(Swal.fire).toHaveBeenCalledWith({
            title: mockError.message,
            icon: 'error',
        });
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

    test('should trigger applyFacets and set isLoading on click', async () => {
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
            <div x-data="serenityFacetForm">
                <form x-bind="form">
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

    test('should build query string and call applyFacets on form submit', async () => {
        const mockApplyFacets = jest.fn();
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        componentInstance.applyFacets = mockApplyFacets;

        const button = document.querySelector('button');
        button.click();
        await delayPromise();

        const expectedUrl = '/?test-input=test-value';
        expect(mockApplyFacets).toHaveBeenCalledWith(expectedUrl);
        expect(componentInstance.isLoading).toBe(true);
    });
});
