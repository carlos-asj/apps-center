
describe("GET /clients", () => {
  describe("Anonymous user", () => {
    test("Retrieving clients on the table", async () => {
      const response = await fetch("http://localhost:3000/clients");
      expect(response.status).toBe(200);
      
    })
  })
})