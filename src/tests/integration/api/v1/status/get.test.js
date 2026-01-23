test("/health endpoint should return 200", async () => {
  res = await fetch("http://localhost:3000/health/postgres");
  expect(res.status).toBe(200);
});
