const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
const path = require("path");
const TestData = require("./models/TestData");

dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;
const TOP_K = 5;

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = "rag_db";
const MONGODB_COLLECTION = "documents";
const MONGODB_VECTOR_INDEX = "vector_index";
const MONGODB_VECTOR_PATH = process.env.MONGODB_VECTOR_PATH || "embedding";

const VOYAGE_API_KEY = process.env.VOYAGE_API_KEY;
const VOYAGE_EMBEDDING_MODEL = "voyage-3-lite";

const LLM_API_KEY = process.env.LLM_API_KEY;

let mongoClient;
let mongoDb;

function ensureEnv(name, value) {
	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}
}

async function connectToMongo() {
	ensureEnv("MONGODB_URI", MONGODB_URI);

	if (mongoDb) {
		return;
	}

	try {
		mongoClient = new MongoClient(MONGODB_URI);
		await mongoClient.connect();
		mongoDb = mongoClient.db(MONGODB_DB_NAME);
		console.log("Connected to MongoDB");
	} catch (error) {
		mongoClient = undefined;
		mongoDb = undefined;
		console.error(`Failed to connect to MongoDB: ${error.message}`);
		throw error;
	}
}

async function ensureMongooseConnection() {
	ensureEnv("MONGODB_URI", MONGODB_URI);

	if (mongoose.connection.readyState === 1) {
		return;
	}

	await mongoose.connect(MONGODB_URI, {
		dbName: MONGODB_DB_NAME,
	});
}

function getCollection() {
	if (!mongoDb) {
		throw new Error("MongoDB connection is not initialized.");
	}

	return mongoDb.collection(MONGODB_COLLECTION);
}

async function getEmbedding(question) {
	ensureEnv("VOYAGE_API_KEY", VOYAGE_API_KEY);

	const response = await fetch("https://api.voyageai.com/v1/embeddings", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${VOYAGE_API_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: VOYAGE_EMBEDDING_MODEL,
			input: question,
		}),
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Voyage embedding request failed: ${response.status} ${errorText}`);
	}

	const payload = await response.json();
	const embedding = payload?.data?.[0]?.embedding;

	if (!Array.isArray(embedding)) {
		throw new Error("Voyage API returned an invalid embedding payload.");
	}

	return embedding;
}

async function vectorSearch(embedding) {
	const collection = getCollection();

	const pipeline = [
		{
			$vectorSearch: {
				index: MONGODB_VECTOR_INDEX,
				path: MONGODB_VECTOR_PATH,
				queryVector: embedding,
				numCandidates: 100,
				limit: TOP_K,
			},
		},
		{
			$project: {
				_id: 0,
				score: { $meta: "vectorSearchScore" },
				text: 1,
				content: 1,
				title: 1,
				source: 1,
				metadata: 1,
			},
		},
	];

	return collection.aggregate(pipeline).toArray();
}

function stringifyContextValue(value) {
	if (value == null) {
		return "";
	}

	if (typeof value === "string") {
		return value;
	}

	return JSON.stringify(value);
}

function extractContextText(doc) {
	const candidates = [doc.text, doc.content, doc.metadata?.text, doc.metadata?.content];

	for (const value of candidates) {
		const result = stringifyContextValue(value).trim();
		if (result) {
			return result;
		}
	}

	return "";
}

function normalizeLlmContent(content) {
	if (typeof content === "string") {
		return content.trim();
	}

	if (Array.isArray(content)) {
		return content
			.map((item) => {
				if (typeof item === "string") {
					return item;
				}

				if (typeof item?.text === "string") {
					return item.text;
				}

				return "";
			})
			.join("\n")
			.trim();
	}

	return "";
}

async function generateAnswer(question, docs) {
	ensureEnv("LLM_API_KEY", LLM_API_KEY);

	const retrievedDocs = docs.map((doc) => {
		if (typeof doc?.text === "string" && doc.text.trim()) {
			return doc.text;
		}

		if (typeof doc?.content === "string" && doc.content.trim()) {
			return doc.content;
		}

		return "";
	});

	const context = retrievedDocs.join("\n\n");

	console.log("Retrieved docs:", retrievedDocs.length);
	console.log("Context length:", context.length);

	const prompt = `
You are a helpful fintech AI assistant.

Use the context below to answer the user's question.
If the context is empty or not useful, answer using your own knowledge.

Context:
${context}

User Question:
${question}

Provide a clear and concise answer.
`;

	const response = await fetch(
		`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${LLM_API_KEY}`,
		{
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			contents: [
				{
					parts: [{ text: prompt }],
				},
			],
		}),
	}
	);

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Gemini request failed: ${response.status} ${errorText}`);
	}

	const responseData = await response.json();
	const answer = responseData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

	if (!answer) {
		throw new Error("Gemini response did not include answer content.");
	}

	return answer;
}

// ==================== TEST ROUTES ====================

app.get("/test", (_req, res) => {
	return res.json({
		message: "Server is working",
	});
});

app.get("/test-db", async (_req, res) => {
	try {
		await connectToMongo();
		const collection = getCollection();
		await collection.findOne({}, { projection: { _id: 1 } });

		return res.json({
			message: "MongoDB is working",
		});
	} catch (error) {
		return res.status(500).json({
			error: "MongoDB test failed",
			details: error.message,
		});
	}
});

// Test Route 1: Check MongoDB Connection
app.get("/test/check-connection", async (req, res) => {
	try {
		await connectToMongo();
		const adminDb = mongoDb.admin();
		const status = await adminDb.ping();
		
		console.log("✅ MongoDB Connection Successful!");
		console.log("Database Name:", MONGODB_DB_NAME);
		console.log("Collection Name:", MONGODB_COLLECTION);
		
		return res.json({
			success: true,
			message: "Connected to MongoDB successfully",
			database: MONGODB_DB_NAME,
			collection: MONGODB_COLLECTION,
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error("❌ MongoDB Connection Failed:", error.message);
		return res.status(500).json({
			success: false,
			error: "Failed to connect to MongoDB",
			details: error.message,
		});
	}
});

// Test Route 2: Insert Dummy Data
app.post("/test/insert-dummy-data", async (req, res) => {
	try {
		await connectToMongo();
		const collection = getCollection();

		const dummyRecords = [
			{
				name: "John Doe",
				email: "john@example.com",
				budget: 5000,
				category: "Investment",
				timestamp: new Date(),
				createdAt: new Date(),
			},
			{
				name: "Jane Smith",
				email: "jane@example.com",
				budget: 3000,
				category: "Savings",
				timestamp: new Date(),
				createdAt: new Date(),
			},
			{
				name: "Mike Johnson",
				email: "mike@example.com",
				budget: 7500,
				category: "Budget Tracking",
				timestamp: new Date(),
				createdAt: new Date(),
			},
		];

		const result = await collection.insertMany(dummyRecords);
		
		console.log(`✅ Successfully inserted ${result.insertedCount} records`);
		console.log("Inserted IDs:", result.insertedIds);

		return res.json({
			success: true,
			message: `Inserted ${result.insertedCount} dummy records`,
			insertedIds: result.insertedIds,
			records: dummyRecords,
		});
	} catch (error) {
		console.error("❌ Failed to insert dummy data:", error.message);
		return res.status(500).json({
			success: false,
			error: "Failed to insert dummy data",
			details: error.message,
		});
	}
});

// Test Route 3: Fetch All Records
app.get("/test/get-all-records", async (req, res) => {
	try {
		await connectToMongo();
		const collection = getCollection();

		const records = await collection.find({}).toArray();

		console.log(`✅ Retrieved ${records.length} records from database`);
		records.forEach((record, index) => {
			console.log(`Record ${index + 1}:`, record);
		});

		return res.json({
			success: true,
			totalRecords: records.length,
			records: records,
		});
	} catch (error) {
		console.error("❌ Failed to fetch records:", error.message);
		return res.status(500).json({
			success: false,
			error: "Failed to fetch records",
			details: error.message,
		});
	}
});

// Test Route 4: Delete All Test Records
app.delete("/test/delete-all-records", async (req, res) => {
	try {
		await connectToMongo();
		const collection = getCollection();

		const result = await collection.deleteMany({});

		console.log(`✅ Deleted ${result.deletedCount} records`);

		return res.json({
			success: true,
			message: `Deleted ${result.deletedCount} records`,
			deletedCount: result.deletedCount,
		});
	} catch (error) {
		console.error("❌ Failed to delete records:", error.message);
		return res.status(500).json({
			success: false,
			error: "Failed to delete records",
			details: error.message,
		});
	}
});

// ==================== END TEST ROUTES ====================

app.post("/add-data", async (req, res) => {
	try {
		const name = req.body?.name?.trim();
		const message = req.body?.message?.trim();

		if (!name || !message) {
			return res.status(400).json({
				error: "Both name and message are required.",
			});
		}

		await ensureMongooseConnection();
		const savedData = await TestData.create({ name, message });

		return res.status(201).json({
			success: true,
			message: "Data saved successfully",
			data: savedData,
		});
	} catch (error) {
		return res.status(500).json({
			error: "Failed to save data",
			details: error.message,
		});
	}
});

app.get("/get-data", async (_req, res) => {
	try {
		await ensureMongooseConnection();
		const data = await TestData.find({}).sort({ createdAt: -1 }).lean();

		return res.json({
			success: true,
			data,
		});
	} catch (error) {
		return res.status(500).json({
			error: "Failed to fetch data",
			details: error.message,
		});
	}
});

app.post("/ask", async (req, res) => {
	const question = req.body?.question?.trim();

	if (!question) {
		return res.status(400).json({
			error: "Question is required. Send JSON body: { \"question\": \"...\" }",
		});
	}

	try {
		const embedding = await getEmbedding(question);
		const documents = await vectorSearch(embedding);
		const answer = await generateAnswer(question, documents);

		return res.json({
			answer,
		});
	} catch (error) {
		console.error("/ask request failed:", error);

		return res.status(500).json({
			error: "Failed to process /ask request",
			details: error.message,
		});
	}
});

app.get("/health", (_req, res) => {
	res.json({ status: "OK" });
});

async function closeMongoConnection() {
	if (mongoClient) {
		await mongoClient.close();
		mongoClient = undefined;
		mongoDb = undefined;
		console.log("Disconnected from MongoDB");
	}
}

async function closeMongooseConnection() {
	if (mongoose.connection.readyState !== 0) {
		await mongoose.connection.close();
	}
}

async function shutdown(signal) {
	console.log(`Received ${signal}. Shutting down server...`);

	try {
		await closeMongooseConnection();
		await closeMongoConnection();
	} finally {
		process.exit(0);
	}
}

process.on("SIGINT", () => {
	void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
	void shutdown("SIGTERM");
});

async function initializeOptionalServices() {
	try {
		await connectToMongo();
	} catch (error) {
		console.warn("MongoDB not connected, running in degraded mode");
		console.warn(`MongoDB initialization error: ${error.message}`);
	}
}

if (require.main === module) {
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
		void initializeOptionalServices();
	});
}

module.exports = {
	app,
	getEmbedding,
	vectorSearch,
	generateAnswer,
};
