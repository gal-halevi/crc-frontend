describe('My CRC - Smoke Test', () => {
  beforeEach(() => {
    cy.visit('/src/index.html'); // Adjust the path if necessary
  });

  it('should update visitor count after API response', () => {
      cy.intercept('POST', 'https://vl974b3ut5.execute-api.us-east-1.amazonaws.com/default/visitorCounter', {
        statusCode: 200,
        body: { visitorCount: 123 },
      }).as('getVisitorCount');
    
      cy.wait('@getVisitorCount'); // Wait for the API call to complete
    
      cy.get('#visitorCount').should('have.text', '123');
  });

  it("should increment visitor counter after refresh", () => {
    cy.get("#visitorCount")
      .should("be.visible")
      .invoke("text")
      .should("match", /^\d+$/) // Ensure it contains only digits
      .then((initialCount) => {
        initialCount = parseInt(initialCount, 10); // Convert to integer
        cy.reload();

        cy.wait(1000);
        
        cy.get("#visitorCount")
          .should("be.visible")
          .invoke("text")
          .should("match", /^\d+$/) // Ensure new count is also a number
          .then((newCount) => {
            newCount = parseInt(newCount, 10);
            expect(newCount).to.be.greaterThan(initialCount);
          });
      });
  });

  it("should handle error when an invalid payload is submitted", () => {

    // Send an invalid payload directly to the API
    cy.request({
      method: "POST",
      url: "https://vl974b3ut5.execute-api.us-east-1.amazonaws.com/default/visitorCounter", // Use relative URL if baseUrl is set
      body: { invalidKey: "invalidValue" }, // Example of invalid payload
      failOnStatusCode: false // Prevent Cypress from failing on non-2xx responses
    }).then((response) => {
      expect(response.status).to.be.equal(500); // Expecting a validation error
    });
  });
});