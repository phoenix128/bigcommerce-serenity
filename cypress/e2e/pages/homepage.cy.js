describe('Homepage', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('loads homepage', () => {
        cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('displays main elements', () => {
        cy.get('header').should('be.visible');
        cy.get('nav').should('be.visible');
        cy.get('footer').should('be.visible');
    });
});