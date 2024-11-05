// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('waitSerenityPageReady', () => {
    cy.window().then((win) => {
        return new Cypress.Promise((resolve, reject) => {
            win.addEventListener('serenityPageReady', () => {
                resolve();
            });
        });
    });
});

Cypress.Commands.add('getAlpine', () => {
    cy.window().its('Alpine').should('exist').then((win) => {
        return win.Alpine;
    });
});

Cypress.Commands.add('getAlpineData', ($el) => {
    cy.getAlpine().then((Alpine) => {
        const alpineData = Alpine.$data($el[0]);
        if (alpineData) {
            return Promise.resolve(alpineData);
        }

        return Promise.reject('No Alpine.js data found');
    });
});
