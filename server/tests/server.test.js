const request = require("supertest");
const app = require("../ragServer");

describe("Server basic functionality", () => {
	it("returns success from GET /test", async () => {
		const response = await request(app).get("/test");

		expect(response.status).toBe(200);
		expect(response.body).toEqual({ message: "Server is working" });
	});

	it("returns 404 for an unknown route", async () => {
		const response = await request(app).get("/this-route-does-not-exist");

		expect(response.status).toBe(404);
	});
});
