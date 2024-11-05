describe('Cookie banner', () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.visit('/');
    });

    it('should display the cookie banner', () => {
        cy.get('#consent-manager').should('be.visible');
    });

    it('should dismiss if clicking on reject', () => {
        cy.intercept(' /api/storefront/consent').as('consentFetch');

        cy.get('#consent-manager').should('be.visible');
        cy.get('#consent-manager button').eq(1).click(); // Reject is the 2nd button

        cy.wait('@consentFetch').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
        });

        cy.get('#consent-manager').should('not.be.visible');

        cy.visit('/cart.php');
        cy.get('#consent-manager').should('not.be.visible');
    });

    it('should dismiss if clicking on accept', () => {
        cy.intercept(' /api/storefront/consent').as('consentFetch');

        cy.get('#consent-manager').should('be.visible');
        cy.get('#consent-manager button').eq(2).click(); // Accept is the 3rd button

        cy.wait('@consentFetch').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
        });

        cy.get('#consent-manager').should('not.be.visible');

        cy.visit('/cart.php');
        cy.get('#consent-manager').should('not.be.visible');
    });
});