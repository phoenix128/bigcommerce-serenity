import './write-review';

const delayPromise = async (ms = 50) => {
    await Alpine.nextTick();
    await new Promise((resolve) => setTimeout(resolve, ms));
};

describe('serenityWriteReview', () => {
    let originalLocation;

    beforeAll(() => {
        Alpine.start();
        Alpine.store('serenityModal', {
            openContent: jest.fn(),
        });

        originalLocation = window.location;

        delete window.location;
        window.location = { href: '', assign: jest.fn() };
    });

    beforeEach(() => {
        document.body.innerHTML = `
            <div x-data="serenityWriteReview({ ajaxUrl: '/write-review', isAjax: true })">
                <div x-ref="content">Review content</div>
                <button x-bind="el">Write a Review</button>
            </div>
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

    test('should initialize with correct default values', () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        expect(componentInstance.isOpen).toBe(false);
        expect(componentInstance.ajaxUrl).toBe('/write-review');
        expect(componentInstance.isAjax).toBe(true);
    });

    test('should redirect to ajaxUrl if isAjax is true', () => {
        const component = document.querySelector('[x-data]');
        component.click();

        expect(window.location.href).toBe('/write-review');
    });

    test('should open modal with content if isAjax is false', async () => {
        const component = document.querySelector('[x-data]');
        const componentInstance = Alpine.$data(component);
        componentInstance.isAjax = false;

        component.click();
        await delayPromise();

        expect(Alpine.store('serenityModal').openContent).toHaveBeenCalledWith('Review content');
    });

    test('should throw error if modal is not found', async () => {
        Alpine.store('serenityModal', 0);
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));

        expect(() => componentInstance.getModal()).toThrow('Modal not found');
    });
});
