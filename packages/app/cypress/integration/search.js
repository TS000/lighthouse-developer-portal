import search from '../fixtures/search/query.json';

describe('Search', () => {
  // Set current user as guest, visit the homepage, and open the feedback modal
  beforeEach(() => {
    cy.intercept(
      { method: 'GET', url: '**/api/search/query?term=**' },
      {
        statusCode: 200,
        body: search,
      },
    );
    window.localStorage.setItem('@backstage/core:SignInPage:provider', 'guest');
    window.localStorage.setItem(
      '/notifications/dismissedBanners',
      '["beta_dismissable"]',
    );
    cy.visit('/');

    cy.contains('Starter Guide').should('be.visible');
  });

  it('should show the search button', () => {
    cy.contains('Search').should('be.visible');
  });

  it('should open the search modal', () => {
    cy.get('button')
      .contains('Search in Lighthouse Developer Portal')
      .should('be.visible')
      .click();
    cy.get('input')
      .invoke('attr', 'placeholder')
      .should('contain', 'Search in Lighthouse Developer Portal');

    cy.contains('monorepo').should('be.visible');
  });

  it('should link to catalog page', () => {
    cy.get('button')
      .contains('Search in Lighthouse Developer Portal')
      .should('be.visible')
      .click();
    cy.get('input')
      .invoke('attr', 'placeholder')
      .should('contain', 'Search in Lighthouse Developer Portal');

    cy.contains('monorepo').should('be.visible').click();

    cy.url().should('match', /catalog\/default\/component\/lighthouse-developer-portal-monorepo/);
  });

  it('should redirect to the search page', () => {
    cy.get('button')
      .contains('Search in Lighthouse Developer Portal')
      .should('be.visible')
      .click();
    cy.get('input[placeholder="Search in Lighthouse Developer Portal"]').type(
      '{enter}',
    );

    cy.url().should('match', /search\?query=.*/);
    cy.contains('Search');
  });
});