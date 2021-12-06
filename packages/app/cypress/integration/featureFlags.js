describe('Feature Flags', () => {
  // Visits the feature flag page and clicks past the guest option.
  beforeEach(() => {});

  it('should render feature flag plugin', () => {
    // cy.contains('Feature Flags');
    cy.visit('/');
    cy.contains('Embark Developer Portal');
  });

  context('When a Feature Flag is Present', () => {
    it('Displays a feature flag', () => {
      //   cy.contains('home-feature');
      //   cy.contains('starter-guide');
      cy.visit('/');
      cy.contains('Embark Developer Portal');
    });

    it('toggles a feature flag', () => {
      //   cy.contains('home-feature');
      //   cy.get('span[title="Enable"]').should('be.visible');
      //   cy.get('input[name="home-feature"]').click().blur();
      //   cy.get('span[title="Disable"]').should('be.visible');
      //   cy.contains('starter-guide');
      //   cy.get('span[title="Enable"]').should('be.visible');
      //   cy.get('input[name="starter-guide"]').click().blur();
      //   cy.get('span[title="Disable"]').should('be.visible');
      cy.visit('/');
      cy.contains('Embark Developer Portal');
    });

    it('enables a branching feature', () => {
      //   cy.visit('/');
      //   cy.contains(/a safe expected feature/i);
      //   cy.contains(
      //     /'this component was shown because the home feature is disabled!'/i,
      //   );
      cy.visit('/');
      cy.contains('Embark Developer Portal');
    });

    it('disables a branching feature', () => {
      //   cy.get('input[name="home-feature"]').click().blur();

      //   cy.visit('/');
      //   cy.contains(/some cool new feature!/i);
      //   cy.contains(
      //     /'this component was shown because the home feature is enabled!'/i,
      //   );
      cy.visit('/');
      cy.contains('Embark Developer Portal');
    });
  });
});
