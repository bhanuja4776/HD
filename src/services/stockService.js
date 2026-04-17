const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY;
const BASE_URL = "https://www.alphavantage.co/query";

const EMPTY_STOCK_DATA = {
	price: null,
	change: null,
	percent: null
};

const toNumber = (value) => {
	const parsed = Number.parseFloat(value);
	return Number.isFinite(parsed) ? parsed : null;
};

export const getStockPrice = async (symbol) => {
	const normalizedSymbol = typeof symbol === "string" ? symbol.trim().toUpperCase() : "";

	if (!normalizedSymbol) {
		return { ...EMPTY_STOCK_DATA };
	}

	if (!API_KEY) {
		console.error("Missing VITE_ALPHA_VANTAGE_KEY environment variable.");
		return { ...EMPTY_STOCK_DATA };
	}

	const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(normalizedSymbol)}&apikey=${API_KEY}`;

	try {
		console.log("Fetching stock:", symbol);
		const response = await fetch(url);

		if (!response.ok) {
			console.error(`Alpha Vantage request failed with status ${response.status}.`);
			return { ...EMPTY_STOCK_DATA };
		}

		const data = await response.json();
		console.log("Stock API response:", data);

		if (data?.["Error Message"] || data?.Note || data?.Information) {
			console.error("Alpha Vantage API returned an error:", data);
			return { ...EMPTY_STOCK_DATA };
		}

		const quote = data?.["Global Quote"];
		if (!quote || Object.keys(quote).length === 0) {
			console.warn("Stock data missing for:", symbol);
			return null;
		}

		return {
			price: toNumber(quote["05. price"]),
			change: toNumber(quote["09. change"]),
			percent: toNumber(String(quote["10. change percent"] || "").replace("%", ""))
		};
	} catch (error) {
		console.error("Failed to fetch stock price:", error);
		return { ...EMPTY_STOCK_DATA };
	}
};

