import './tabs';

const delayPromise = async (ms = 100) => {
    await Alpine.nextTick();
    await new Promise((resolve) => setTimeout(resolve, ms));
};

describe('serenityTab', () => {
    beforeAll(async () => {
        Alpine.start();
        await delayPromise();
    });

    beforeEach(async () => {
        document.body.innerHTML = `
            <div x-data="serenityTab({ activeTab: 'description', transition: false })">
                <button x-data="serenityTabButton({ code: 'description' })" data-code="description-button">Description</button>
                <button x-data="serenityTabButton({ code: 'reviews' })" data-code="reviews-button">Reviews</button>
                <button x-data="serenityTabButton({ code: 'specs' })" data-code="specs-button">Specs</button>

                <div x-cloak x-data="serenityTabContent({ code: 'description' })" data-code="description">Description Content</div>
                <div x-cloak x-data="serenityTabContent({ code: 'reviews' })" data-code="reviews">Reviews Content</div>
                <div x-cloak x-data="serenityTabContent({ code: 'specs' })" data-code="specs">Specs Content</div>
            </div>
        `;
        Alpine.initTree(document.body);
        await delayPromise();
    });

    afterEach(async () => {
        Alpine.destroyTree(document.body);
        await delayPromise();
    });

    test('initializes with the correct active tab', async () => {
        const descriptionContent = document.querySelector('[data-code="description"]');
        const reviewsContent = document.querySelector('[data-code="reviews"]');
        const specsContent = document.querySelector('[data-code="specs"]');

        expect(descriptionContent).toBeVisible();
        expect(reviewsContent).not.toBeVisible();
        expect(specsContent).not.toBeVisible();
    });

    test('clicking a tab button activates the corresponding content', async () => {
        const reviewsButton = document.querySelector('[data-code="reviews-button"]');
        const reviewsContent = document.querySelector('[data-code="reviews"]');
        const descriptionContent = document.querySelector('[data-code="description"]');

        reviewsButton.click();
        await delayPromise();

        expect(reviewsContent).toBeVisible();
        expect(descriptionContent).not.toBeVisible();
    });

    test('clicking a tab button adds the active class to the button', async () => {
        const descriptionButton = document.querySelector('[data-code="description-button"]');
        const reviewsButton = document.querySelector('[data-code="reviews-button"]');

        reviewsButton.click();
        await delayPromise();

        expect(reviewsButton.classList.contains('tab-button-active')).toBe(true);
        expect(descriptionButton.classList.contains('tab-button-active')).toBe(false);
    });
});
