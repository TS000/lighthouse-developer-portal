const GITHUB_ISSUE_URL =
  '/repos/department-of-veterans-affairs/lighthouse-developer-portal/issues';

describe('FeedbackModal', () => {
  // Set current user as guest, visit the homepage, and open the feedback modal
  beforeEach(() => {
    window.localStorage.setItem('@backstage/core:SignInPage:provider', 'guest');
    window.localStorage.setItem(
      '/notifications/dismissedBanners',
      '["beta_dismissable"]',
    );
    cy.visit('/');
    cy.get('h6').contains('Feedback').click();
  });

  it('should open the feedback modal', () => {
    cy.contains('Provide feedback on the Lighthouse developer portal').should(
      'be.visible',
    );
  });

  it('should close the feedback modal', () => {
    cy.visit('/');
    cy.get('h6').contains('Feedback').click();
    cy.contains('Provide feedback on the Lighthouse developer portal').should(
      'be.visible',
    );
    cy.get('span').contains('Cancel').should('be.visible').click();
    cy.contains('Provide feedback on the Lighthouse developer portal').should(
      'not.exist',
    );
  });

  it('should not submit when textarea is empty', () => {
    cy.contains('Provide feedback on the Lighthouse developer portal').should(
      'be.visible',
    );
    cy.get('button').contains('Submit').parent().should('be.disabled');
  });

  context('Submitting feedback', () => {
    // Confirm the feedback modal is open, and enter the text within the textarea
    beforeEach(() => {
      cy.contains('Provide feedback on the Lighthouse developer portal').should(
        'be.visible',
      );
      cy.get('textarea').first().type('feedback is awesome!');
    });

    it('should submit the form when the text area has content', () => {
      // Submit the form
      cy.get('button')
        .contains('Submit')
        .parent()
        .should('not.be.disabled')
        .click();
      cy.contains('Provide feedback on the Lighthouse developer portal').should(
        'not.exist',
      );
    });

    // TODO: re add tests for successful feedback once we can fake authentication
    // @see https://github.com/department-of-veterans-affairs/lighthouse-developer-portal/pull/468

    it('should display a dismissable message after failed submit', () => {
      cy.intercept(
        { method: 'POST', url: GITHUB_ISSUE_URL },
        {
          statusCode: 404,
          body: '404 Not Found!',
          headers: {
            'x-not-found': 'true',
          },
        },
      );

      // Submit the form
      cy.get('button')
        .contains('Submit')
        .parent()
        .should('not.be.disabled')
        .click();

      cy.get('div')
        .contains('Failed to submit feedback. Please try again later.')
        .should('be.visible');
      cy.contains('Provide feedback on the Lighthouse developer portal').should(
        'not.exist',
      );
    });
  });
});
