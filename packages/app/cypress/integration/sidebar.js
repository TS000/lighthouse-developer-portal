describe('sidebar', () => {
  // Set current user as guest, visit the homepage, and open the feedback modal
  beforeEach(() => {
    window.localStorage.setItem('@backstage/core:SignInPage:provider', 'guest');
  });

  context('when sidebar is pinned', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.get('h6').contains('Catalog').trigger('mouseover');
    });

    it('should open a sidebarSubmenu', () => {
      cy.contains('Components').should('be.visible');
      cy.contains('APIs').should('be.visible');
      cy.contains('Systems').should('be.visible');
    });

    it('component link redirects to the correct catalog url', () => {
      cy.contains('Components').should('be.visible').click();
      cy.url().should('include', '?filters[kind]=component');
    });

    it('api link redirects to the correct catalog url', () => {
      cy.contains('APIs').should('be.visible').click();
      cy.url().should('include', '?filters[kind]=api');
    });

    it('system link redirects to the correct catalog url', () => {
      cy.contains('Systems').should('be.visible').click();
      cy.url().should('include', '?filters[kind]=system');
    });
  });

  context('When sidebar is not pinned', () => {
    // Set current user as guest, visit the homepage, and open the feedback modal
    beforeEach(() => {
      window.localStorage.setItem('sidebarPinState', 'false');
      cy.reload();
      cy.visit('/');
    });

    it('closes when submenu link is clicked', () => {
      cy.get('[aria-label="Catalog"]')
        .should('be.visible')
        .trigger('mouseover');
      cy.contains('Components').should('be.visible').click();
      cy.url().should('include', '?filters[kind]=component');

      cy.get('h6').contains('Catalog').should('not.exist');
    });
  });
});
