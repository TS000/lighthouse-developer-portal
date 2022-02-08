describe('Explore Page', () => {
  it('should not render the explore page', () => {
    window.localStorage.setItem('@backstage/core:SignInPage:provider', 'guest');
    cy.visit('/plugins');
    cy.get('[data-testid=error]').should('be.visible');
  });
});
