import JustValidate from 'just-validate';
import './contact-us-form';

const delayPromise = async (ms = 50) => {
    await Alpine.nextTick();
    await new Promise((resolve) => setTimeout(resolve, ms));
};

describe('serenityContactUsForm', () => {
    let originalSubmit;

    beforeAll(() => {
        Alpine.start();

        Alpine.store('context', {
            contactEmail: 'Please enter a valid email address',
            contactQuestion: 'Please enter your question',
        });
    });

    beforeEach(async () => {
        document.body.innerHTML = `
            <div x-data="serenityContactUsForm">
                <form x-bind="contactUsForm">
                    <input type="email" x-bind="emailField" data-validation='{"type": "email", "required": true}' />
                    <textarea x-bind="commentField" data-validation='{"type": "text", "required": true}'></textarea>
                    <button x-bind="submit">Submit</button>
                </form>
            </div>
        `;

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

    test('should initialize validation on form', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));

        await delayPromise();

        // Ensure validator is initialized
        expect(componentInstance.validator).toBeInstanceOf(JustValidate);
    });

    test('should set isSubmitting to true and disable submit button on form submission', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        const submitButton = componentInstance.$refs.submitButton;

        // Set field values to pass validation
        componentInstance.$refs.emailField.value = 'test@example.com';
        componentInstance.$refs.commentField.value = 'This is a test question';

        submitButton.click();

        await delayPromise(500); // Wait for debounce and processing

        expect(componentInstance.isSubmitting).toBe(true);
        expect(submitButton.disabled).toBe(true);
        expect(submitButton.classList.contains('cursor-progress')).toBe(true);
    });

    test('should submit form after validation success', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        const form = componentInstance.$refs.contactUsForm;
        const submitButton = componentInstance.$refs.submitButton;

        jest.spyOn(form, 'submit').mockImplementation(() => {
        });

        componentInstance.$refs.emailField.value = 'test@example.com';
        componentInstance.$refs.commentField.value = 'This is a test question';

        submitButton.click();

        await delayPromise(500); // 200ms timeout + 300ms delay for tolerance

        expect(form.submit).toHaveBeenCalled();
    });

    test('should not submit form if validation fails', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        const form = componentInstance.$refs.contactUsForm;
        const submitButton = componentInstance.$refs.submitButton;

        submitButton.click();

        await delayPromise(500);

        expect(form.submit).not.toHaveBeenCalled();
    });

    test('should validate email and content fields', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        const submitButton = componentInstance.$refs.submitButton;

        submitButton.click();

        await delayPromise();

        expect(document.body).toHaveTextContent('Please enter a valid email address');
        expect(document.body).toHaveTextContent('Please enter your question');
    });

    test('should wait 200ms before submitting to make sure the csrf token is set', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        const form = componentInstance.$refs.contactUsForm;
        const submitButton = componentInstance.$refs.submitButton;

        jest.spyOn(form, 'submit').mockImplementation(() => {
        });

        componentInstance.$refs.emailField.value = 'test@example.com';
        componentInstance.$refs.commentField.value = 'This is a test question';

        submitButton.click();

        await delayPromise(50); // Initial wait to confirm no early submit
        expect(form.submit).not.toHaveBeenCalled();

        await delayPromise(250); // Total 200ms delay for token readiness
        expect(form.submit).toHaveBeenCalled();
    });
});
