import './login-form';
import JustValidate from 'just-validate';

const delayPromise = async (ms = 50) => {
    await Alpine.nextTick();
    await new Promise((resolve) => setTimeout(resolve, ms));
};

describe('serenityLoginForm', () => {
    let originalSubmit;

    beforeAll(() => {
        Alpine.start();

        Alpine.store('context', {
            useValidEmail: 'Please enter a valid email address',
            enterPass: 'Password is required',
        });
    });

    beforeEach(async () => {
        document.body.innerHTML = `
            <div x-data="serenityLoginForm">
                <form x-bind="loginForm">
                    <input type="email" x-bind="email" data-validation='{"type": "email", "required": true}' />
                    <div x-bind="emailErrorsContainer"></div>
                    <input type="password" x-bind="password" data-validation='{"type": "password", "required": true}' />
                    <div x-bind="passwordErrorsContainer"></div>
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

    test('should initialize and set up validator on form fields', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        await delayPromise();

        expect(componentInstance.validator).toBeInstanceOf(JustValidate);
    });

    test('should apply validation rules on email and password fields', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        componentInstance.$refs.submitButton.click();

        await delayPromise(200);

        expect(document.body).toHaveTextContent('Email is required');
        expect(document.body).toHaveTextContent('Password is required');
    });

    test('should disable submit button and show loading state while submitting', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        const submitButton = componentInstance.$refs.submitButton;
        const form = componentInstance.$refs.loginForm;

        jest.spyOn(form, 'submit').mockImplementation(() => {
        });

        // Set email and password values to pass validation
        componentInstance.$refs.emailField.value = 'test@example.com';
        componentInstance.$refs.passwordField.value = 'password123';

        submitButton.click();

        await delayPromise(500); // Wait for debounce and processing

        expect(componentInstance.isSubmitting).toBe(true);
        expect(submitButton.disabled).toBe(true);
        expect(submitButton.classList.contains('cursor-progress')).toBe(true);
    });

    test('should submit form after validation success', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        const form = componentInstance.$refs.loginForm;

        jest.spyOn(form, 'submit').mockImplementation(() => {
        });

        componentInstance.$refs.emailField.value = 'test@example.com';
        componentInstance.$refs.passwordField.value = 'password123';

        const submitButton = componentInstance.$refs.submitButton;
        submitButton.click();

        await delayPromise(500); // 200ms timeout + 300ms delay for tolerance

        expect(form.submit).toHaveBeenCalled();
    });

    test('should not submit form if validation fails', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        const form = componentInstance.$refs.loginForm;

        componentInstance.$refs.emailField.value = '';
        componentInstance.$refs.passwordField.value = '';

        const submitButton = componentInstance.$refs.submitButton;
        submitButton.click();

        await delayPromise(500);

        expect(form.submit).not.toHaveBeenCalled();
    });

    test('should wait 200ms before submitting to make sure the csrf token is set', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        const form = componentInstance.$refs.loginForm;

        jest.spyOn(form, 'submit').mockImplementation(() => {
        });

        componentInstance.$refs.emailField.value = 'test@example.com';
        componentInstance.$refs.passwordField.value = 'password123';

        const submitButton = componentInstance.$refs.submitButton;
        submitButton.click();

        await delayPromise(50); // Initial wait to confirm no early submit
        expect(form.submit).not.toHaveBeenCalled();

        await delayPromise(250); // Total 200ms delay for token readiness
        expect(form.submit).toHaveBeenCalled();
    });
});
