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

  it('changes the dropdown when clicked', () => {
    cy.visit('/catalog');
    cy.get('div').contains('Components').should('be.visible').click();
    cy.get('li[data-value="api"]').should('be.visible').click();
    cy.contains('lighthouse-developer-portal/backend').should('be.visible');
  });
});
