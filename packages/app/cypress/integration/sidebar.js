import locations from '../fixtures/locations.json';
import entitiesComponents from '../fixtures/entities/components.json';
import entitiesApis from '../fixtures/entities/apis.json';

describe('sidebar', () => {
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
      cy.url().should('match', /\?filters.*kind.*=component/);
    });

    it('api link redirects to the correct catalog url', () => {
      cy.contains('APIs').should('be.visible').click();
      cy.url().should('match', /\?filters.*kind.*=api/);
    });

    it('system link redirects to the correct catalog url', () => {
      cy.contains('Systems').should('be.visible').click();
      cy.url().should('match', /\?filters.*kind.*=system/);
    });

    it('changes with dropdown', () => {
      cy.contains('Components').should('be.visible').click();
      cy.url().should('match', /\?filters.*kind.*=component/);
      cy.get('h1').contains('Catalog').click();

      cy.get('div').contains('Components').should('be.visible').click();
      cy.get('li[data-value="api"]').should('be.visible').click();
      cy.url().should('match', /\?filters.*kind.*=api/);
      cy.contains('/backend').should('be.visible');
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
      cy.url().should('match', /\?filters.*kind.*=component/);

      cy.get('h6').contains('Catalog').should('not.exist');
    });
  });
});
