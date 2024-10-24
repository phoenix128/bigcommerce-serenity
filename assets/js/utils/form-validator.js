import JustValidate from "just-validate";
import { createTranslationDictionary } from "./translations-utils";

const getJvRules = (formElement, type, label, validationRules) => {
    const context = Alpine.store('context');
    const validationDictionary = createTranslationDictionary(context);

    formElement.setAttribute('novalidate', 'novalidate');

    const rules = [];

    if (validationRules.required) {
        rules.push({
            rule: 'required',
            errorMessage: `${label}: ${validationDictionary.field_not_blank}`
        });
    }

    switch (type) {
        case 'EmailAddress':
            rules.push({
                rule: 'email',
                errorMessage: validationDictionary.valid_email
            });
            break;

        case 'Password':
            rules.push({
                rule: 'minLength',
                value: context.passwordRequirements.minlength,
            });
            rules.push({
                validator: (value) => {
                    return value.search(/[A-Za-z]/) !== -1 && value.search(/[0-9]/) !== -1;
                },
                errorMessage: validationDictionary.invalid_password,
            });
            break;

        case 'ConfirmPassword':
            rules.push({
                validator: (value) => {
                    const pwd = formElement.querySelector('[data-field-type=Password]').value;
                    return pwd === value;
                },
                errorMessage: validationDictionary.password_match,
            });
            break;

        // TODO: Add checkboxes and radio validations
    }

    return rules;
}

const formValidator = (formElement, options) => {
    const validationBlocks = formElement.querySelectorAll('[data-validation]');
    
    const validate = new JustValidate(formElement, options);
    validationBlocks.forEach((block) => { 
        const fieldId = block.getAttribute('id');
        const fieldValidation = JSON.parse(block.getAttribute('data-validation'));
        const fieldLabel = block.querySelector('[data-label]').getAttribute('data-label');
        const fieldType = block.getAttribute('data-type');
        
        const fieldRules = getJvRules(formElement, fieldType, fieldLabel, fieldValidation);
        if (fieldRules.length > 0) {
            validate.addField(`#${fieldId} select, #${fieldId} input`, fieldRules);
        }
    });

    return validate;
}

export default formValidator;
