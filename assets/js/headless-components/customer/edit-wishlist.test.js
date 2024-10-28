import './edit-wishlist';

const delayPromise = async (ms = 50) => {
    await Alpine.nextTick();
    await new Promise((resolve) => setTimeout(resolve, ms));
};

describe('serenityEditWishlist', () => {
    let originalSubmit;

    beforeAll(() => {
        Alpine.start();
    });

    beforeEach(async () => {
        document.body.innerHTML = `
            <div x-data="serenityEditWishlist">
                <form x-bind="wishlistForm">
                    <input x-bind="wishlistName" name="wishlistName" />
                    <button x-bind="submitButton">Submit</button>
                </form>
            </div>
        `;

        Alpine.store('context', {
            enterWishlistNameError: 'Wishlist name is required',
        });

        originalSubmit = HTMLFormElement.prototype.submit;
        HTMLFormElement.prototype.submit = jest.fn();

        Alpine.initTree(document.body);
        await delayPromise();
    });

    afterEach(async () => {
        Alpine.destroyTree(document.body);
        HTMLFormElement.prototype.submit = originalSubmit;
        jest.clearAllMocks();
        await Alpine.nextTick();
    });

    test('should require wishlist name', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        const form = componentInstance.$refs.wishlistForm;
        const submitButton = componentInstance.$refs.submitButton;

        const wishlistName = componentInstance.$refs.wishlistName;
        wishlistName.value = '';

        submitButton.click();

        await delayPromise(500);
        expect(document.body).toHaveTextContent('Wishlist name is required');

        expect(form.submit).not.toHaveBeenCalled();
    });

    test('should set isSubmitting to true and disable submit button on form submission', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        const form = componentInstance.$refs.wishlistForm;
        const submitButton = componentInstance.$refs.submitButton;

        const wishlistName = componentInstance.$refs.wishlistName;
        wishlistName.value = 'Lorem Ipsu';

        submitButton.click();

        await delayPromise(500);

        expect(componentInstance.isSubmitting).toBe(true);
        expect(submitButton.disabled).toBe(true);
        expect(submitButton.classList.contains('cursor-progress')).toBe(true);
    });

    test('should submit form on successful validation', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        const form = componentInstance.$refs.wishlistForm;
        const submitButton = componentInstance.$refs.submitButton;

        const wishlistName = componentInstance.$refs.wishlistName;
        wishlistName.value = 'Lorem Ipsum';

        submitButton.click();

        await delayPromise(500);

        expect(form.submit).toHaveBeenCalled();
    });

    test('should wait 200ms before submitting to make sure the external csfr token is set', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        const form = componentInstance.$refs.wishlistForm;
        const submitButton = componentInstance.$refs.submitButton;

        const wishlistName = componentInstance.$refs.wishlistName;
        wishlistName.value = 'Lorem Ipsum';

        submitButton.click();
        await delayPromise(50);
        expect(form.submit).not.toHaveBeenCalled();

        await delayPromise(250);
        expect(form.submit).toHaveBeenCalled();
    });
});
