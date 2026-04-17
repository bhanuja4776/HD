const request = require("supertest");

const baseApp = require("../ragServer");

function createMockedApp(options = {}) {
	const {
		mongoConnectError,
		mongooseConnectError,
		embeddingShouldFail = false,
		llmShouldFail = false,
		llmEmptyAnswer = false,
	} = options;

	jest.resetModules();

	const originalEnv = { ...process.env };
	process.env.MONGODB_URI = "mongodb://example.local/rag";
	process.env.VOYAGE_API_KEY = "voyage-key";
	process.env.LLM_API_KEY = "llm-key";

	const testRecords = [{ _id: "1", name: "A", message: "B" }];

	const mockCollection = {
		findOne: jest.fn(async () => ({ _id: "abc" })),
		insertMany: jest.fn(async () => ({ insertedCount: 3, insertedIds: { 0: "1", 1: "2", 2: "3" } })),
		find: jest.fn(() => ({ toArray: jest.fn(async () => testRecords) })),
		deleteMany: jest.fn(async () => ({ deletedCount: 3 })),
		aggregate: jest.fn(() => ({ toArray: jest.fn(async () => [{ text: "Doc context" }]) })),
	};

	class MockMongoClient {
		constructor() {
			this.connect = jest.fn(async () => {
				if (mongoConnectError) {
					throw new Error(mongoConnectError);
				}
			});
			this.db = jest.fn(() => ({
				collection: jest.fn(() => mockCollection),
				admin: jest.fn(() => ({ ping: jest.fn(async () => ({ ok: 1 })) })),
			}));
			this.close = jest.fn(async () => undefined);
		}
	}

	const mockMongoose = {
		connection: { readyState: 0, close: jest.fn(async () => undefined) },
		connect: jest.fn(async () => {
			if (mongooseConnectError) {
				throw new Error(mongooseConnectError);
			}
		}),
	};

	const mockTestData = {
		create: jest.fn(async ({ name, message }) => ({ _id: "created", name, message })),
		find: jest.fn(() => ({
			sort: jest.fn(() => ({ lean: jest.fn(async () => testRecords) })),
		})),
	};

	global.fetch = jest.fn(async (url) => {
		if (String(url).includes("voyageai")) {
			if (embeddingShouldFail) {
				return {
					ok: false,
					status: 429,
					text: async () => "rate limited",
				};
			}

			return {
				ok: true,
				json: async () => ({ data: [{ embedding: [0.1, 0.2, 0.3] }] }),
			};
		}

		if (String(url).includes("generativelanguage.googleapis.com")) {
			if (llmShouldFail) {
				return {
					ok: false,
					status: 500,
					text: async () => "model unavailable",
				};
			}

			if (llmEmptyAnswer) {
				return {
					ok: true,
					json: async () => ({ candidates: [{ content: { parts: [{ text: "   " }] } }] }),
				};
			}

			return {
				ok: true,
				json: async () => ({
					candidates: [{ content: { parts: [{ text: "Mocked answer" }] } }],
				}),
			};
		}

		return {
			ok: false,
			status: 404,
			text: async () => "unknown endpoint",
		};
	});

	jest.doMock("mongodb", () => ({ MongoClient: MockMongoClient }));
	jest.doMock("mongoose", () => mockMongoose);
	jest.doMock("../models/TestData", () => mockTestData);

	const app = require("../ragServer");

	return {
		app,
		restore: () => {
			process.env = originalEnv;
			delete global.fetch;
		},
	};
}

describe("Base routes and validation", () => {
	it("GET /health returns status OK", async () => {
		const response = await request(baseApp).get("/health");

		expect(response.status).toBe(200);
		expect(response.body).toEqual({ status: "OK" });
	});

	it("GET /test returns server message", async () => {
		const response = await request(baseApp).get("/test");

		expect(response.status).toBe(200);
		expect(response.body).toEqual({ message: "Server is working" });
	});

	it("POST /ask with missing question returns 400", async () => {
		const response = await request(baseApp).post("/ask").send({});

		expect(response.status).toBe(400);
		expect(response.body.error).toMatch(/Question is required/);
	});

	it("POST /ask with blank question returns 400", async () => {
		const response = await request(baseApp).post("/ask").send({ question: "   " });

		expect(response.status).toBe(400);
	});

	it("POST /add-data with invalid payload returns 400", async () => {
		const response = await request(baseApp).post("/add-data").send({ name: "", message: "" });

		expect(response.status).toBe(400);
		expect(response.body).toEqual({ error: "Both name and message are required." });
	});
});

describe("Mongo and data routes with mocked successful dependencies", () => {
	let mocked;

	beforeAll(() => {
		mocked = createMockedApp();
	});

	afterAll(() => {
		mocked.restore();
	});

	it("GET /test-db returns mongo success", async () => {
		const response = await request(mocked.app).get("/test-db");

		expect(response.status).toBe(200);
		expect(response.body).toEqual({ message: "MongoDB is working" });
	});

	it("GET /test/check-connection returns success details", async () => {
		const response = await request(mocked.app).get("/test/check-connection");

		expect(response.status).toBe(200);
		expect(response.body.success).toBe(true);
		expect(response.body.database).toBe("rag_db");
		expect(response.body.collection).toBe("documents");
	});

	it("POST /test/insert-dummy-data inserts records", async () => {
		const response = await request(mocked.app).post("/test/insert-dummy-data").send({});

		expect(response.status).toBe(200);
		expect(response.body.success).toBe(true);
		expect(response.body.message).toMatch(/Inserted 3 dummy records/);
	});

	it("GET /test/get-all-records returns records", async () => {
		const response = await request(mocked.app).get("/test/get-all-records");

		expect(response.status).toBe(200);
		expect(response.body.success).toBe(true);
		expect(response.body.totalRecords).toBeGreaterThanOrEqual(1);
	});

	it("DELETE /test/delete-all-records returns delete count", async () => {
		const response = await request(mocked.app).delete("/test/delete-all-records");

		expect(response.status).toBe(200);
		expect(response.body.success).toBe(true);
		expect(response.body.deletedCount).toBe(3);
	});

	it("POST /add-data with valid payload creates data", async () => {
		const response = await request(mocked.app)
			.post("/add-data")
			.send({ name: "Alice", message: "Hello" });

		expect(response.status).toBe(201);
		expect(response.body.success).toBe(true);
		expect(response.body.data).toMatchObject({ name: "Alice", message: "Hello" });
	});

	it("GET /get-data returns sorted data payload", async () => {
		const response = await request(mocked.app).get("/get-data");

		expect(response.status).toBe(200);
		expect(response.body.success).toBe(true);
		expect(Array.isArray(response.body.data)).toBe(true);
	});

	it("POST /ask returns generated answer", async () => {
		const response = await request(mocked.app).post("/ask").send({ question: "What is SIP?" });

		expect(response.status).toBe(200);
		expect(response.body).toEqual({ answer: "Mocked answer" });
	});
});

describe("Error cases with mocked failures", () => {
	it("POST /ask returns 500 when embedding API fails", async () => {
		const mocked = createMockedApp({ embeddingShouldFail: true });
		const response = await request(mocked.app).post("/ask").send({ question: "Explain risk" });

		expect(response.status).toBe(500);
		expect(response.body.error).toBe("Failed to process /ask request");
		expect(response.body.details).toMatch(/Voyage embedding request failed/);

		mocked.restore();
	});

	it("POST /ask returns 500 when LLM response is empty", async () => {
		const mocked = createMockedApp({ llmEmptyAnswer: true });
		await request(mocked.app).get("/test-db");
		const response = await request(mocked.app).post("/ask").send({ question: "Explain budgeting" });

		expect(response.status).toBe(500);
		expect(response.body.details).toMatch(/did not include answer content/);

		mocked.restore();
	});

	it("GET /test-db returns 500 when Mongo connection fails", async () => {
		const mocked = createMockedApp({ mongoConnectError: "DB unavailable" });
		const response = await request(mocked.app).get("/test-db");

		expect(response.status).toBe(500);
		expect(response.body.error).toBe("MongoDB test failed");
		expect(response.body.details).toMatch(/DB unavailable/);

		mocked.restore();
	});

	it("POST /add-data returns 500 when mongoose connect fails", async () => {
		const mocked = createMockedApp({ mongooseConnectError: "Mongoose offline" });
		const response = await request(mocked.app)
			.post("/add-data")
			.send({ name: "Bob", message: "Test" });

		expect(response.status).toBe(500);
		expect(response.body.error).toBe("Failed to save data");
		expect(response.body.details).toMatch(/Mongoose offline/);

		mocked.restore();
	});
});
