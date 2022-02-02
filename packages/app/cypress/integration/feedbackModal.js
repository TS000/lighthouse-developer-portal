const GITHUB_ISSUE_URL =
  '/repos/department-of-veterans-affairs/lighthouse-embark/issues';

describe('FeedbackModal', () => {
  // Set current user as guest, visit the homepage, and open the feedback modal
  beforeEach(() => {
    window.localStorage.setItem('@backstage/core:SignInPage:provider', 'guest');
    cy.visit('/');
    cy.get('h6').contains('Feedback').click();
  });

  it('should open the feedback modal', () => {
    cy.contains('Provide feedback for Embark').should('be.visible');
  });

  it('should close the feedback modal', () => {
    cy.contains('Provide feedback for Embark').should('be.visible');
    cy.get('span').contains('Cancel').should('be.visible').click();
    cy.contains('Provide feedback for Embark').should('not.exist');
  });

  it('should not submit when textarea is empty', () => {
    cy.contains('Provide feedback for Embark').should('be.visible');
    cy.get('button').contains('Submit').parent().should('be.disabled');
  });

  context('Submitting feedback', () => {
    // Confirm the feedback modal is open, and enter the text within the textarea
    beforeEach(() => {
      cy.contains('Provide feedback for Embark').should('be.visible');
      cy.get('textarea').first().type('feedback is awesome!');
    });

    it('should submit the form when the text area has content', () => {
      // Submit the form
      cy.get('button')
        .contains('Submit')
        .parent()
        .should('not.be.disabled')
        .click();
      cy.contains('Provide feedback for Embark').should('not.exist');
    });

    it('should submit the issue to github', () => {
      // Intercept the submitted feedback
      cy.intercept({ method: 'POST', url: GITHUB_ISSUE_URL }, 'success').as(
        'submitResponse',
      );

      // Submit the form
      cy.get('button')
        .contains('Submit')
        .parent()
        .should('not.be.disabled')
        .click();

      // Validate that the request body contains the same text we submitted
      cy.wait('@submitResponse')
        .its('request.body.body')
        .should('eq', 'feedback is awesome!');
      cy.contains('Provide feedback for Embark').should('not.exist');
    });

    it('should display a dismissable message after successful submit', () => {
      // Intercept the submitted feedback
      cy.intercept({ method: 'POST', url: GITHUB_ISSUE_URL }, 'success');

      // Submit the form
      cy.get('button')
        .contains('Submit')
        .parent()
        .should('not.be.disabled')
        .click();

      cy.get('div')
        .contains('Feedback submitted! View it on GitHub.')
        .should('be.visible');
      cy.contains('Provide feedback for Embark').should('not.exist');
    });

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
      cy.contains('Provide feedback for Embark').should('not.exist');
    });
  });
});
