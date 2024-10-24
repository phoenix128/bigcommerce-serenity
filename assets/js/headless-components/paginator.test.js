import './paginator';

const delayPromise = async (ms = 50) => {
    await Alpine.nextTick();
    await new Promise((resolve) => setTimeout(resolve, ms));
};

describe('serenityPaginator and serenityPaginatorPage', () => {
    beforeAll(() => {
        Alpine.start();
    });

    beforeEach(() => {
        document.body.innerHTML = `
            <html>
                <body>
                    <div x-data="serenityPaginator({ currentPage: 2 })">
                        <div test-id="page-1" x-data="serenityPaginatorPage({ number: 1, url: '/page/1' })">
                            <a x-bind="pageLink">Page 1</a>
                        </div>
                        <div test-id="page-2" x-data="serenityPaginatorPage({ number: 2, url: '/page/2' })">
                            <a x-bind="pageLink">Page 2</a>
                        </div>
                        <div test-id="page-3" x-data="serenityPaginatorPage({ number: 3, url: '/page/3' })">
                            <a x-bind="pageLink">Page 3</a>
                        </div>
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

    test('initializes with the correct current page', () => {
        const componentInstance = Alpine.$data(document.querySelector('[test-id=page-2]'));
        expect(componentInstance.isCurrent).toBe(true);
    });

    test('clicking on the current page does not change isLoading', async () => {
        const currentPageElement = document.querySelector('[test-id=page-2]');
        const link = currentPageElement.querySelector('a');
        const componentInstance = Alpine.$data(currentPageElement);

        link.click();
        await delayPromise();

        expect(componentInstance.isLoading).toBe(false);
    });

    test('clicking on a different page sets it to loading', async () => {
        const otherPageElement = document.querySelector('[test-id=page-1]');
        const link = otherPageElement.querySelector('a');
        const componentInstance = Alpine.$data(otherPageElement);

        link.click();
        await delayPromise();

        expect(componentInstance.isLoading).toBe(true);
    });

    test('href attribute should be correctly set for each page', () => {
        const pageLinks = document.querySelectorAll('a');

        expect(pageLinks[0].getAttribute('href')).toBe('/page/1');
        expect(pageLinks[1].getAttribute('href')).toBe('/page/2');
        expect(pageLinks[2].getAttribute('href')).toBe('/page/3');
    });

    test('class changes based on isCurrent and isLoading states', async () => {
        const otherPageElement = document.querySelector('[test-id=page-1]');
        const link = otherPageElement.querySelector('a');
        const componentInstance = Alpine.$data(otherPageElement);

        expect(link.classList.contains('cursor-pointer')).toBe(true);

        link.click();
        await delayPromise();

        expect(link.classList.contains('cursor-progress')).toBe(true);
    });
});
