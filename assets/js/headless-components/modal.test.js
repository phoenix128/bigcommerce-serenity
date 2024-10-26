import './modal';

describe('serenityModal', () => {
    beforeAll(() => {
        Alpine.start();
    });

    beforeEach(() => {
        document.body.innerHTML = `
            <div x-data="serenityModal({ initialState: false, transition: true })">
                <div x-bind="contentBox">
                    <div x-ref="content" x-html="contentHtml"></div>
                </div>
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

        expect(componentInstance.isOpen).toBe(false);
        expect(componentInstance.isLoading).toBe(false);
        expect(componentInstance.contentHtml).toBe('');
    });

    test('should open with content when openContent is called', () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        const mockHtmlContent = '<p>Modal Content</p>';

        componentInstance.openContent(mockHtmlContent);

        expect(componentInstance.isOpen).toBe(true);
        expect(componentInstance.isLoading).toBe(false);
        expect(componentInstance.contentHtml).toBe(mockHtmlContent);
    });

    test('should show loading state when openLoading is called', () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));

        componentInstance.openLoading();

        expect(componentInstance.isOpen).toBe(true);
        expect(componentInstance.isLoading).toBe(true);
        expect(componentInstance.contentHtml).toBe('');
    });

    test('should close modal when close is called', () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));

        componentInstance.openContent('<p>Some Content</p>');
        componentInstance.close();

        expect(componentInstance.isOpen).toBe(false);
        expect(componentInstance.isLoading).toBe(false);
    });

    test('should clear content when clearContent is called', () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));

        componentInstance.openContent('<p>Some Content</p>');
        componentInstance.clearContent();

        expect(componentInstance.contentHtml).toBe('');
    });
});
