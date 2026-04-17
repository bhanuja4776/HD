const request = require("supertest");
const { app } = require("../ragServer");

describe("GET /health", () => {
	it('returns 200 and { status: "OK" }', async () => {
		const response = await request(app).get("/health");

		expect(response.status).toBe(200);
		expect(response.body).toEqual({ status: "OK" });
	});
});
