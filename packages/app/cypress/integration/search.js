import search from '../fixtures/search/query.json';

describe('FeedbackModal', () => {
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
    cy.get('h1').contains('Embark Developer Portal').should('be.visible');
  });

  it('should show the search button', () => {
    cy.contains('Search in Embark Developer Portal').should('be.visible');
  });

  it('should open the search modal', () => {
    cy.get('button')
      .contains('Search in Embark Developer Portal')
      .should('be.visible')
      .click();
    cy.get('input')
      .invoke('attr', 'placeholder')
      .should('contain', 'Search in Embark Developer Portal');
    cy.contains('embark-monorepo').should('be.visible');
  });

  it('should link to catalog page', () => {
    cy.get('button')
      .contains('Search in Embark Developer Portal')
      .should('be.visible')
      .click();
    cy.get('input')
      .invoke('attr', 'placeholder')
      .should('contain', 'Search in Embark Developer Portal');
    cy.contains('embark-monorepo').should('be.visible').click();

    cy.url().should('match', /catalog\/default\/component\/embark-monorepo/);
  });

  it('should redirect to the search page', () => {
    cy.get('button')
      .contains('Search in Embark Developer Portal')
      .should('be.visible')
      .click();
    cy.get('input[placeholder="Search in Embark Developer Portal"]').type(
      '{enter}',
    );

    cy.url().should('match', /search\?query=.*/);
    cy.contains('Search');
  });
});
