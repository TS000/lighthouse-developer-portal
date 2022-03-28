import locations from '../fixtures/locations.json';
import entitiesComponents from '../fixtures/entities/components.json';
import entitiesApis from '../fixtures/entities/apis.json';

describe('Catalog Page', () => {
  // Set current user as guest, visit the homepage, and open the feedback modal
  beforeEach(() => {
    cy.intercept(
      { method: 'GET', url: '**/api/catalog/entities?fields=kind**' },
      {
        statusCode: 202,
        body: locations,
      },
    );
    cy.intercept(
      { method: 'GET', url: '**/api/catalog/entities?filter=kind=component**' },
      {
        statusCode: 202,
        body: entitiesComponents,
      },
    );
    cy.intercept(
      { method: 'GET', url: '**/api/catalog/entities?filter=kind=api**' },
      {
        statusCode: 202,
        body: entitiesApis,
      },
    );
    window.localStorage.setItem('@backstage/core:SignInPage:provider', 'guest');
  });

  it('selects APIs tab by default', () => {
    cy.visit('/catalog');
    cy.contains("Browse the collection of APIs").should('be.visible');

  });

  it('changes the tab when clicked', () => {
    cy.visit('/catalog');
    cy.get('div').contains('Components').should('be.visible').click();
    cy.contains("Browse the collection of Components").should('be.visible');

  });
});
