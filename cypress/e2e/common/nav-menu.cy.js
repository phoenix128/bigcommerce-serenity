describe('Homepage', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('should display navigation', () => {
        cy.get('[x-data^="serenityNavigation"]')
            .filter((index, element) => {
                return Cypress.$(element).attr('x-data').startsWith('serenityNavigation(');
            })
            .should('be.visible');
    });

    it('should display the mobile navigation menu and hide the desktop version', () => {
        const desktopNav = cy.get('[x-data^="serenityNavigation"]')
            .filter((index, element) => {
                return Cypress.$(element).attr('x-data').startsWith('serenityNavigation(');
            }).first();

        const mobileNav = cy.get('[x-data^="serenityNavigation"]')
            .filter((index, element) => {
                return Cypress.$(element).attr('x-data').startsWith('serenityNavigation(');
            }).last();

        cy.viewport(1920, 1080);
        desktopNav.should('be.visible');
        mobileNav.should('not.be.visible');

        cy.viewport('iphone-x');
        desktopNav.should('not.be.visible');
        mobileNav.should('be.visible');
    });

    it('should have all active links working', () => {
        cy.get('[x-data^="serenityNavigation"]')
            .filter((index, element) => {
                return Cypress.$(element).attr('x-data').startsWith('serenityNavigation(');
            })
            .first()
            .find('a[href^="/"]')
            .then((menuElements) => {
                const hrefs = [];
                Cypress.$(menuElements).each((index, element) => {
                    const href = Cypress.$(element).attr('href');
                    hrefs.push(href);
                });

                cy.wrap(hrefs).should('have.length.greaterThan', 0).then((hrefs) => {
                    for (const href of hrefs) {
                        cy.get(`[x-data^="serenityNavigation"] a[href="${href}"]`).first().then((link) => {
                            cy.getAlpineData(link).then((alpineEl) => {
                                alpineEl.open();
                            });

                            cy.get(link).click();
                            cy.waitSerenityPageReady();
                            cy.url().should('contain', href);
                        });
                    }
                });
            });
    });
});