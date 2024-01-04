describe("Login with Username and Password", () => {
  const username = "test";
  const password = "test";

  it("should login success", () => {
    cy.visit("/");
    cy.url().should("include", "/login");

    cy.get("input[placeholder='ชื่อผู้ใช้'").type(username + "{enter}");
    cy.get("input[placeholder='รหัสผ่าน'").type(password + "{enter}");

    cy.get("h2").should("contain.text", "My Courses");
  });

  it("should login fail", () => {
    cy.visit("/");
    cy.url().should("include", "/login");

    cy.get("input[placeholder='ชื่อผู้ใช้'").type(username + "{enter}");
    cy.get("input[placeholder='รหัสผ่าน'").type("wrongpassword" + "{enter}");

    cy.url().should("include" , "?error=wrong-credential")
  });
});
