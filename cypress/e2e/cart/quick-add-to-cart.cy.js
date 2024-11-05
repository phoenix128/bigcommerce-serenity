describe('Context', () => {
    it('should add a product to cart and load the cart page', () => {
        const testCategory = Cypress.env('testCategory');

        cy.visit(`/cart.php`);
        cy.get('[x-data^=serenityCartContent]').should('not.exist');

        cy.visit(`/${testCategory}`);

        cy.get('[x-data^=serenityQuickAddToCartButton]').should('exist').first().click();
        cy.waitSerenityPageReady();

        cy.url().should('contain', '/cart.php');
        cy.get('[x-data^=serenityCartContent]').should('exist');
    });
});
