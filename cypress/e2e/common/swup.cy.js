describe('Swup', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('should include a #swup root', () => {
        cy.get('#swup').should('exist');
    });

    it('should have a #swup-check element inside #swup', () => {
        cy.get('#swup > #swup-check').should('exist');
    });

    it('swup should be loaded', () => {
        cy.window().its('swup').should('exist');
    });
});