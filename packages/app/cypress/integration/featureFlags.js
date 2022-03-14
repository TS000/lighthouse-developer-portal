describe('Feature Flags', () => {
  // Visits the feature flag page and clicks past the guest option.
  beforeEach(() => {
    window.localStorage.setItem('@backstage/core:SignInPage:provider', 'guest');
    cy.visit('/feature-flags');
  });

  it('should render feature flag plugin', () => {
    cy.contains('Feature Flags');
  });

  context('When a Feature Flag is Present', () => {
    it('Displays a feature flag', () => {
      cy.contains('radar-dashboard');
    });

    it('toggles a feature flag', () => {
      cy.contains('radar-dashboard');
      cy.get('span[title="Enable"]').should('be.visible');
      cy.get('input[name="radar-dashboard"]').click().blur();
      cy.get('span[title="Disable"]').should('be.visible');
    });

    it('has an enabled feature', () => {
      cy.get('span[title="Enable"]').should('be.visible');
      cy.get('input[name="radar-dashboard"]').click().blur();
      cy.contains('Tech Radar').should('be.visible');
    });

    it('disables a branching feature', () => {
      cy.contains('Tech Radar').should('not.exist');
    });
  });
});
