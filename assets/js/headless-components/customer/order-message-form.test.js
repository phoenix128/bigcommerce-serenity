import JustValidate from 'just-validate';
import './order-message-form';

const delayPromise = async (ms = 50) => {
    await Alpine.nextTick();
    await new Promise((resolve) => setTimeout(resolve, ms));
};

describe('serenityOrderMessageForm', () => {
    let originalSubmit;

    beforeAll(() => {
        Alpine.start();

        Alpine.store('context', {
            enterOrderNum: 'Order ID is required',
            enterSubject: 'Subject is required',
            enterMessage: 'Message content is required',
        });
    });

    beforeEach(async () => {
        document.body.innerHTML = `
            <div x-data="serenityOrderMessageForm">
                <form x-bind="orderMessageForm">
                    <input type="text" x-bind="orderIdField" data-validation='{"type": "text", "required": true}' />
                    <input type="text" x-bind="messageSubjectField" data-validation='{"type": "text", "required": true}' />
                    <textarea x-bind="messageContentField" data-validation='{"type": "text", "required": true}'></textarea>
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

    test('should initialize validation', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        componentInstance.$refs.submitButton.click();

        await delayPromise();

        // Check that JustValidate is initialized on the form element
        expect(componentInstance.validator).toBeInstanceOf(JustValidate);
    });

    test('should validate order ID, subject, and message content fields', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        const submitButton = componentInstance.$refs.submitButton;

        submitButton.click();

        await delayPromise();

        // Check that validation messages are displayed
        expect(document.body).toHaveTextContent('Order ID is required');
        expect(document.body).toHaveTextContent('Subject is required');
        expect(document.body).toHaveTextContent('Message content is required');
    });

    test('should set isSubmitting to true and disable submit button on form submission', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        const submitButton = componentInstance.$refs.submitButton;

        // Set field values to pass validation
        componentInstance.$refs.orderIdField.value = '123456';
        componentInstance.$refs.messageSubjectField.value = 'Subject';
        componentInstance.$refs.messageContentField.value = 'This is a test message';

        submitButton.click();

        await delayPromise(500); // Wait for debounce and processing

        expect(componentInstance.isSubmitting).toBe(true);
        expect(submitButton.disabled).toBe(true);
        expect(submitButton.classList.contains('cursor-progress')).toBe(true);
    });

    test('should submit form after validation success', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        const form = componentInstance.$refs.orderMessageForm;
        const submitButton = componentInstance.$refs.submitButton;

        jest.spyOn(form, 'submit').mockImplementation(() => {
        });

        componentInstance.$refs.orderIdField.value = '123456';
        componentInstance.$refs.messageSubjectField.value = 'Subject';
        componentInstance.$refs.messageContentField.value = 'This is a test message';

        submitButton.click();

        await delayPromise(500); // 200ms timeout + 300ms delay for tolerance

        expect(form.submit).toHaveBeenCalled();
    });

    test('should not submit form if validation fails', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        const form = componentInstance.$refs.orderMessageForm;
        const submitButton = componentInstance.$refs.submitButton;

        submitButton.click();

        await delayPromise(500);

        expect(form.submit).not.toHaveBeenCalled();
    });

    test('should wait 200ms before submitting to make sure the csrf token is set', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        const form = componentInstance.$refs.orderMessageForm;
        const submitButton = componentInstance.$refs.submitButton;

        jest.spyOn(form, 'submit').mockImplementation(() => {
        });

        componentInstance.$refs.orderIdField.value = '123456';
        componentInstance.$refs.messageSubjectField.value = 'Subject';
        componentInstance.$refs.messageContentField.value = 'This is a test message';

        submitButton.click();

        await delayPromise(50); // Initial wait to confirm no early submit
        expect(form.submit).not.toHaveBeenCalled();

        await delayPromise(250); // Total 200ms delay for token readiness
        expect(form.submit).toHaveBeenCalled();
    });
});
