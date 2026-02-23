describe("GET tables", () => {
  describe("Anonymous user", () => {
    test("Retrieving current clients state", async () => {
      const response = await fetch("http://localhost:3000/clients");
      expect(response.status).toBe(200);
    })

    test("Retrieving current equips state", async () => {
      const response = await fetch("http://localhost:3000/equips");
      expect(response.status).toBe(200);
    })
  })
})