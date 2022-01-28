describe('Explore Page', () => {
  it('should render the explore page', () => {
    window.localStorage.setItem('@backstage/core:SignInPage:provider', 'guest');
    cy.visit('/');
    cy.get('h6').contains('Plugins').click();
    cy.contains('Explore the Embark ecosystem');
  });
});
