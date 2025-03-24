describe('My CRC - Smoke Test', () => {
    beforeEach(() => {
      cy.visit('/'); // Adjust the path if necessary
    });
  
    it('should have a visitor counter element', () => {
      cy.get('#visitorCount').should('exist');
    });

    it('should update visitor count after API response', () => {
        cy.intercept('POST', 'https://8w6pp5iid7.execute-api.us-east-1.amazonaws.com/default/updateVisitorCounter', {
          statusCode: 200,
          body: { visitorCount: 123 },
        }).as('getVisitorCount');
      
        cy.wait('@getVisitorCount'); // Wait for the API call to complete
      
        cy.get('#visitorCount').should('have.text', '123');
      });
  });