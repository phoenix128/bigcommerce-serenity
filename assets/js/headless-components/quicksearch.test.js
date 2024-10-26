import './quicksearch';
import utils from '@bigcommerce/stencil-utils';

jest.mock('@bigcommerce/stencil-utils', () => ({
    api: {
        search: {
            search: jest.fn(),
        },
    },
}));

const delayPromise = async (ms = 50) => {
    await Alpine.nextTick();
    await new Promise((resolve) => setTimeout(resolve, ms));
};

describe('serenityQuickSearch', () => {
    let originalLocation;

    beforeAll(() => {
        Alpine.start();

        originalLocation = window.location;

        delete window.location;
        window.location = {
            href: '',
            assign: jest.fn(),
        };
    });

    beforeEach(() => {
        document.body.innerHTML = `
            <html>
                <body>
                    <div x-data="serenityQuickSearch({ searchUrl: '/search', template: 'search/quick-results' })">
                        <input type="text" x-bind="input" x-ref="input" />
                        <div x-bind="loading">Loading...</div>
                        <div x-bind="results"></div>
                        <button x-bind="clearButton">Clear</button>
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

    afterAll(() => {
        window.location = originalLocation;
    });

    test('should initialize with no results and not loading', () => {
        const resultsDiv = document.querySelector('[x-bind="results"]');
        const loadingDiv = document.querySelector('[x-bind="loading"]');

        expect(resultsDiv).toBeEmptyDOMElement();
        expect(loadingDiv).not.toBeVisible();
    });

    test('should display loading indicator and fetch results on input', async () => {
        const input = document.querySelector('[x-ref="input"]');
        const resultsDiv = document.querySelector('[x-bind="results"]');
        const loadingDiv = document.querySelector('[x-bind="loading"]');

        const mockHtml = `
            <ul>
                <li><a href="/search-result-1">Search Result 1</a></li>
                <li><a href="/search-result-2">Search Result 2</a></li>
                <li><a href="/search-result-3">Search Result 3</a></li>
            </ul>`;

        utils.api.search.search.mockImplementation((query, options, callback) => {
            setTimeout(() => {
                callback(null, mockHtml);
            }, 100);
        });

        input.value = 'test query';
        input.dispatchEvent(new Event('input'));
        await delayPromise(550); // 500ms is the debounce time + 50ms

        expect(loadingDiv).toBeVisible();
        expect(resultsDiv).toBeEmptyDOMElement();

        await delayPromise(100); // Wait for the search to complete
        expect(loadingDiv).not.toBeVisible();
        expect(resultsDiv).toContainHTML(`<div x-bind="results">${mockHtml}</div>`);
    });

    test('should clear input text and results on clear button click', async () => {
        const input = document.querySelector('[x-ref="input"]');
        const clearButton = document.querySelector('[x-bind="clearButton"]');
        const resultsDiv = document.querySelector('[x-bind="results"]');

        const mockHtml = `
            <ul>
                <li><a href="/search-result-1">Search Result 1</a></li>
                <li><a href="/search-result-2">Search Result 2</a></li>
                <li><a href="/search-result-3">Search Result 3</a></li>
            </ul>`;

        utils.api.search.search.mockImplementation((query, options, callback) => {
            setTimeout(() => {
                callback(null, mockHtml);
            }, 100);
        });

        input.value = 'test query';
        input.dispatchEvent(new Event('input'));
        await delayPromise(750); // Wait for the search to complete

        expect(resultsDiv).toContainHTML(`<div x-bind="results">${mockHtml}</div>`);

        clearButton.click();
        await delayPromise();

        expect(resultsDiv).toBeEmptyDOMElement();
        expect(input.value).toBe('');
    });

    test('should navigate to search page on enter key', async () => {
        const input = document.querySelector('[x-ref="input"]');

        input.value = 'test query';
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        await delayPromise();

        expect(window.location.href).toBe('/search?search_query=test%20query');
    });

    test('should clear results on escape key press', async () => {
        const input = document.querySelector('[x-ref="input"]');
        const resultsDiv = document.querySelector('[x-bind="results"]');

        // Mock the search function
        utils.api.search.search.mockImplementation((query, options, callback) => {
            setTimeout(() => {
                const mockHtml = `
                    <ul>
                        <li><a href="/search-result-1">Search Result 1</a></li>
                        <li><a href="/search-result-2">Search Result 2</a></li>
                        <li><a href="/search-result-3">Search Result 3</a></li>
                    </ul>`;
                callback(null, mockHtml);
            }, 50);
        });

        input.value = 'test query';
        input.dispatchEvent(new Event('input'));
        await delayPromise();

        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        await delayPromise();

        expect(resultsDiv).toBeEmptyDOMElement();
        expect(input.value).toBe('');
    });
});
