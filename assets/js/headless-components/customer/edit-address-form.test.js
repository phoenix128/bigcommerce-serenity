import './edit-address-form';
import * as formValidator from '../../utils/form-validator';

const delayPromise = async (ms = 50) => {
    await Alpine.nextTick();
    await new Promise((resolve) => setTimeout(resolve, ms));
};

describe('serenityEditAddressForm', () => {
    let originalSubmit;

    beforeAll(() => {
        Alpine.start();

        Alpine.store('context', {
            'validationDefaultDictionaryJSON': `{"locale":"it","locales":{"validation_default_messages.valid_email":"it","validation_default_messages.password":"it","validation_default_messages.password_match":"it","validation_default_messages.invalid_password":"it","validation_default_messages.field_not_blank":"it","validation_default_messages.certificate_amount":"it","validation_default_messages.certificate_amount_range":"it","validation_default_messages.price_min_evaluation":"it","validation_default_messages.price_max_evaluation":"it","validation_default_messages.price_min_not_entered":"it","validation_default_messages.price_max_not_entered":"it","validation_default_messages.price_invalid_value":"it","validation_default_messages.invalid_gift_certificate":"it"},"translations":{"validation_default_messages.valid_email":"Inserisci un indirizzo e-mail valido.","validation_default_messages.password":"Inserisci una password.","validation_default_messages.password_match":"Le password non corrispondono.","validation_default_messages.invalid_password":"Le password devono avere almeno 7 caratteri e contenere caratteri alfabetici e numerici.","validation_default_messages.field_not_blank":"Il campo non può essere vuoto.","validation_default_messages.certificate_amount":"Inserisci un importo per il buono regalo.","validation_default_messages.certificate_amount_range":"L'importo del buono dovrebbe essere compreso tra [MIN] e [MAX]","validation_default_messages.price_min_evaluation":"Il prezzo min. deve essere inferiore al prezzo max.","validation_default_messages.price_max_evaluation":"Il prezzo min. deve essere inferiore al prezzo max.","validation_default_messages.price_min_not_entered":"Il prezzo min. è obbligatorio.","validation_default_messages.price_max_not_entered":"Il prezzo massimo è obbligatorio.","validation_default_messages.price_invalid_value":"Il valore deve essere maggiore di 0.","validation_default_messages.invalid_gift_certificate":"Inserisci un codice del buono valido."}}`,
            'validationDictionaryJSON': `{"locale":"it","locales":{"validation_messages.valid_email":"it","validation_messages.password":"it","validation_messages.password_match":"it","validation_messages.invalid_password":"it","validation_messages.field_not_blank":"it","validation_messages.certificate_amount":"it","validation_messages.certificate_amount_range":"it","validation_messages.price_min_evaluation":"it","validation_messages.price_max_evaluation":"it","validation_messages.price_min_not_entered":"it","validation_messages.price_max_not_entered":"it","validation_messages.price_invalid_value":"it","validation_messages.invalid_gift_certificate":"it"},"translations":{"validation_messages.valid_email":"Inserisci un indirizzo e-mail valido.","validation_messages.password":"Inserisci una password.","validation_messages.password_match":"Le password non corrispondono.","validation_messages.invalid_password":"Le password devono avere almeno 7 caratteri e contenere caratteri alfabetici e numerici.","validation_messages.field_not_blank":" campo non può essere vuoto.","validation_messages.certificate_amount":"Inserisci un importo per il buono regalo.","validation_messages.certificate_amount_range":"L'importo del buono dovrebbe essere compreso tra [MIN] e [MAX]","validation_messages.price_min_evaluation":"Il prezzo min. deve essere inferiore al prezzo max.","validation_messages.price_max_evaluation":"Il prezzo min. deve essere inferiore al prezzo max.","validation_messages.price_min_not_entered":"Il prezzo min. è obbligatorio.","validation_messages.price_max_not_entered":"Il prezzo massimo è obbligatorio.","validation_messages.price_invalid_value":"Il valore deve essere maggiore di 0.","validation_messages.invalid_gift_certificate":"Inserisci un codice del buono valido."}}`,
            'validationFallbackDictionaryJSON': `{"locale":"it","locales":{"validation_fallback_messages.valid_email":"it","validation_fallback_messages.password":"it","validation_fallback_messages.password_match":"it","validation_fallback_messages.invalid_password":"it","validation_fallback_messages.field_not_blank":"it","validation_fallback_messages.certificate_amount":"it","validation_fallback_messages.certificate_amount_range":"it","validation_fallback_messages.price_min_evaluation":"it","validation_fallback_messages.price_max_evaluation":"it","validation_fallback_messages.price_min_not_entered":"it","validation_fallback_messages.price_max_not_entered":"it","validation_fallback_messages.price_invalid_value":"it","validation_fallback_messages.invalid_gift_certificate":"it"},"translations":{"validation_fallback_messages.valid_email":"Inserisci un indirizzo e-mail valido.","validation_fallback_messages.password":"Inserisci una password.","validation_fallback_messages.password_match":"Le password non corrispondono.","validation_fallback_messages.invalid_password":"Le password devono avere almeno 7 caratteri e contenere caratteri alfabetici e numerici.","validation_fallback_messages.field_not_blank":" campo non può essere vuoto.","validation_fallback_messages.certificate_amount":"Inserisci un importo per il buono regalo.","validation_fallback_messages.certificate_amount_range":"L'importo del buono dovrebbe essere compreso tra [MIN] e [MAX]","validation_fallback_messages.price_min_evaluation":"Il prezzo min. deve essere inferiore al prezzo max.","validation_fallback_messages.price_max_evaluation":"Il prezzo min. deve essere inferiore al prezzo max.","validation_fallback_messages.price_min_not_entered":"Il prezzo min. è obbligatorio.","validation_fallback_messages.price_max_not_entered":"Il prezzo massimo è obbligatorio.","validation_fallback_messages.price_invalid_value":"Il valore deve essere maggiore di 0.","validation_fallback_messages.invalid_gift_certificate":"Inserisci un codice del buono valido."}}`,
        });
    });

    beforeEach(async () => {
        document.body.innerHTML = `
            <div x-data="serenityEditAddressForm">
                <form x-bind="addressForm">
                    <input type="text" data-validation='{"type": "text", "required": true}' />
                    <button x-bind="submitButton">Submit</button>
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

    test('should initialize and set up validator on form', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        await delayPromise();

        expect(componentInstance.validator).not.toBeNull();
    });

    test('should destroy previous validator and reinitialize on country change', async () => {
        jest.clearAllMocks(); // Reset the initial calls

        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        const mockValidator = {
            destroy: jest.fn(),
            onSuccess: jest.fn(),
        };
        componentInstance.validator = mockValidator;
        const formValidatorSpy = jest.spyOn(formValidator, 'default');

        componentInstance.onCountryChange();
        await delayPromise();

        expect(mockValidator.destroy).toHaveBeenCalled();
        expect(formValidatorSpy).toHaveBeenCalled();
    });

    test('should submit form after validation success', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        const form = componentInstance.$refs.addressForm;
        const submitButton = componentInstance.$refs.submitButton;
        const addressField = form.querySelector('input');

        addressField.value = '123 Main St';
        submitButton.click();

        await delayPromise(500); // 200ms timeout + 300ms delay for tolerance
        expect(form.submit).toHaveBeenCalled();
    });

    test('should not submit form if validation fails', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        const form = componentInstance.$refs.addressForm;
        const submitButton = componentInstance.$refs.submitButton;
        const addressField = form.querySelector('input');

        addressField.value = '';
        submitButton.click();

        await delayPromise(500); // 200ms timeout + 300ms delay for tolerance
        expect(form.submit).not.toHaveBeenCalled();
    });

    test('should disable submit button and show loading state while submitting', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        const form = componentInstance.$refs.addressForm;
        const submitButton = componentInstance.$refs.submitButton;
        const addressField = form.querySelector('input');

        addressField.value = '123 Main St';
        submitButton.click();

        await delayPromise(500); // 200ms timeout + 300ms delay for tolerance

        // Check that isSubmitting is true and button has loading styles
        expect(submitButton.disabled).toBe(true);
        expect(submitButton.classList.contains('cursor-not-allowed')).toBe(true);
    });

    test('should wait 200ms before submitting to make sure the external csfr token is set', async () => {
        const componentInstance = Alpine.$data(document.querySelector('[x-data]'));
        const form = componentInstance.$refs.addressForm;
        const submitButton = componentInstance.$refs.submitButton;
        const addressField = form.querySelector('input');

        addressField.value = '123 Main St';
        submitButton.click();

        await delayPromise(50); // 50ms delay
        expect(form.submit).not.toHaveBeenCalled();

        await delayPromise(250); // 200ms timeout + 50ms delay
        expect(form.submit).toHaveBeenCalled();
    });
});
