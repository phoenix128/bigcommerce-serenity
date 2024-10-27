import './create-account-form';

const delayPromise = async (ms = 50) => {
    await Alpine.nextTick();
    await new Promise((resolve) => setTimeout(resolve, ms));
};

describe('serenityCreateAccountForm', () => {
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
            <form x-data="serenityCreateAccountForm" x-bind="accountForm">           
                <input type="password" data-type="Password" data-validation='{"type": "password", "required": true, "minlength": 8}' />
                <button type="submit" x-bind="submitButton">Submit</button>
            </form>
        `;

        originalSubmit = HTMLFormElement.prototype.submit;
        HTMLFormElement.prototype.submit = jest.fn();

        Alpine.initTree(document.body);
        await delayPromise();
    });

    afterEach(async () => {
        Alpine.destroyTree(document.body);
        HTMLFormElement.prototype.submit = originalSubmit;
        await delayPromise();
    });

    test('should initialize validator on form load', async () => {
        const formInstance = Alpine.$data(document.querySelector('[x-data]'));

        expect(formInstance.validator).not.toBeNull();
    });

    test('should enable password strength meter on password field', () => {
        const passwordField = document.querySelector('[data-type="Password"]');
        const passwordFieldData = Alpine.$data(passwordField);

        expect(passwordFieldData.passwordStrengthEnabled).toBe(true);
    });

    test('should set isSubmitting to true after successful form submission', async () => {
        const form = document.querySelector('[x-data]');
        const submitButton = document.querySelector('button');

        const passwordField = document.querySelector('[data-type="Password"]');
        passwordField.value = 'password123';

        form.dispatchEvent(new Event('submit', { cancelable: true }));
        await delayPromise(250);

        expect(form.submit).toHaveBeenCalled();
        expect(submitButton.disabled).toBe(true);
    });

    test('should not submit form if validation fails', async () => {
        const form = document.querySelector('[x-data]');

        const passwordField = document.querySelector('[data-type="Password"]');
        passwordField.value = 'abc123';

        form.dispatchEvent(new Event('submit', { cancelable: true }));
        await delayPromise();

        expect(form.submit).not.toHaveBeenCalled();
    });

    test('should reinitialize validator on country change', async () => {
        const formInstance = Alpine.$data(document.querySelector('[x-data]'));
        const previousValidator = formInstance.validator;

        window.dispatchEvent(new CustomEvent('serenityCountrySelect', { detail: { code: 'update' } }));
        await delayPromise();

        expect(formInstance.validator).not.toBe(previousValidator);
    });
});
