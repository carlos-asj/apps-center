
describe("GET /status", () => {
  describe("Anonymous user", () => {
    test("Retrieving current system status", async () => {
      const response = await fetch("http://localhost:3000/status");
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
      expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

      expect(responseBody.dependencies.database.version).toContain("17.7");
      expect(
        responseBody.dependencies.database.max_connections,
      ).toBeGreaterThan(99);
      expect(responseBody.dependencies.database.opened_connections).toEqual(1);
    })
  })
})