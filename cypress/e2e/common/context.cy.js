describe('Context', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('should have a global context object', () => {
        cy.window().its('bcContext').should('exist');
    });
});