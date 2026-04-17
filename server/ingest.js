const axios = require("axios");
const dotenv = require("dotenv");
const fs = require("node:fs/promises");
const path = require("node:path");
const { MongoClient } = require("mongodb");

dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config();

const CHUNK_SIZE = 500;
const CHUNK_OVERLAP = 100;
const VOYAGE_MODEL = "voyage-3-lite";
const VOYAGE_EMBEDDING_DIMENSIONS = 512;
const REQUEST_DELAY_MS = 20000;
const RATE_LIMIT_RETRY_DELAY_MS = 25000;
const SOURCE_FILE = "data.txt";

const MONGODB_URI = process.env.MONGODB_URI;
const VOYAGE_API_KEY = process.env.VOYAGE_API_KEY;

function ensureEnv(name, value) {
	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}
}

function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

function isRateLimitError(error) {
	const statusCode = error?.response?.status;
	const details = error?.response?.data
		? JSON.stringify(error.response.data).toLowerCase()
		: String(error.message || "").toLowerCase();

	return statusCode === 429 || details.includes("rate limit") || details.includes("too many requests");
}

async function readSourceFile() {
	const dataFilePath = path.resolve(__dirname, SOURCE_FILE);

	try {
		return await fs.readFile(dataFilePath, "utf8");
	} catch (error) {
		throw new Error(`Failed to read ${SOURCE_FILE} from server folder: ${error.message}`);
	}
}

function splitIntoChunks(text, chunkSize, overlap) {
	if (chunkSize <= 0) {
		throw new Error("chunkSize must be greater than 0.");
	}

	if (overlap < 0 || overlap >= chunkSize) {
		throw new Error("overlap must be >= 0 and less than chunkSize.");
	}

	const chunks = [];
	const step = chunkSize - overlap;

	for (let start = 0; start < text.length; start += step) {
		const chunk = text.slice(start, start + chunkSize).trim();

		if (chunk) {
			chunks.push(chunk);
		}

		if (start + chunkSize >= text.length) {
			break;
		}
	}

	return chunks;
}

async function getEmbedding(chunk) {
	ensureEnv("VOYAGE_API_KEY", VOYAGE_API_KEY);

	while (true) {
		try {
			const response = await axios.post(
				"https://api.voyageai.com/v1/embeddings",
				{
					model: VOYAGE_MODEL,
					input: chunk,
				},
				{
					headers: {
						Authorization: `Bearer ${VOYAGE_API_KEY}`,
						"Content-Type": "application/json",
					},
					timeout: 30000,
				}
			);

			const embeddingVector = response?.data?.data?.[0]?.embedding;

			if (!Array.isArray(embeddingVector)) {
				throw new Error("Voyage API returned an invalid embedding payload.");
			}

			if (embeddingVector.length !== VOYAGE_EMBEDDING_DIMENSIONS) {
				throw new Error(
					`Unexpected embedding dimension ${embeddingVector.length}. Expected ${VOYAGE_EMBEDDING_DIMENSIONS} for ${VOYAGE_MODEL}.`
				);
			}

			return embeddingVector;
		} catch (error) {
			if (isRateLimitError(error)) {
				console.warn("Voyage API rate limit hit. Waiting 25 seconds before retrying...");
				await sleep(RATE_LIMIT_RETRY_DELAY_MS);
				continue;
			}

			const details = error?.response?.data
				? JSON.stringify(error.response.data)
				: error.message;
			throw new Error(`Voyage API request failed: ${details}`);
		}
	}
}

async function main() {
	ensureEnv("MONGODB_URI", MONGODB_URI);
	ensureEnv("VOYAGE_API_KEY", VOYAGE_API_KEY);

	const rawText = await readSourceFile();

	if (!rawText.trim()) {
		throw new Error(`${SOURCE_FILE} is empty. Add content before running ingestion.`);
	}

	const chunks = splitIntoChunks(rawText, CHUNK_SIZE, CHUNK_OVERLAP);

	if (chunks.length === 0) {
		throw new Error("No chunks were generated from input text.");
	}

	console.log(`Loaded ${SOURCE_FILE}.`);
	console.log(`Chunks created: ${chunks.length}`);

	const documents = [];
	console.log(`Generating embeddings with model ${VOYAGE_MODEL}...`);

	for (let index = 0; index < chunks.length; index += 1) {
		const chunk = chunks[index];
		console.log(`Chunk progress: ${index + 1}/${chunks.length}`);
		const embeddingVector = await getEmbedding(chunk);
		documents.push({
			text: chunk,
			embedding: embeddingVector,
			source: SOURCE_FILE,
		});

		if (index < chunks.length - 1) {
			console.log("Waiting 20 seconds to respect API rate limits...");
			await sleep(REQUEST_DELAY_MS);
		}
	}

	const client = new MongoClient(MONGODB_URI);

	try {
		await client.connect();

		const collection = client.db("rag_db").collection("documents");
		const result = await collection.insertMany(documents, { ordered: true });

		console.log(`Documents inserted: ${result.insertedCount}`);
		console.log(`Inserted into rag_db.documents.`);
	} finally {
		await client.close();
	}
}

main().catch((error) => {
	console.error("Ingestion failed:", error.message);
	process.exitCode = 1;
});

module.exports = {
	splitIntoChunks,
	getEmbedding,
};
