describe('sidebar', () => {
  // Set current user as guest, visit the homepage, and open the feedback modal
  beforeEach(() => {
    window.localStorage.setItem('@backstage/core:SignInPage:provider', 'guest');
    cy.visit('/');
    cy.get('h6').contains('Catalog').trigger('mouseover');
  });

  it('should open a sidebarSubmenu', () => {
    cy.contains('Components').should('be.visible');
    cy.contains('APIs').should('be.visible');
    cy.contains('System').should('be.visible');
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
    cy.contains('System').should('be.visible').click();
    cy.url().should('include', '?filters[kind]=system');
  });
});
