import { useEffect, useState } from "react";
import { getStockPrice } from "../services/stockService";

const formatValue = (value) => {
	if (value === null || value === undefined || Number.isNaN(value)) {
		return "N/A";
	}

	return Number(value).toFixed(2);
};

export const StockPrice = ({ symbol }) => {
	const [stockData, setStockData] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let isMounted = true;
		let intervalId;

		const fetchStock = async (isInitialFetch = false) => {
			if (isInitialFetch && isMounted) {
				setLoading(true);
			}

			const data = await getStockPrice(symbol);

			if (!isMounted) {
				return;
			}

			setStockData(data);
			setLoading(false);
		};

		fetchStock(true);

		intervalId = setInterval(() => {
			fetchStock(false);
		}, 15000);

		return () => {
			isMounted = false;
			if (intervalId) {
				clearInterval(intervalId);
			}
		};
	}, [symbol]);

	if (loading) {
		return (
			<div className="surface-card max-w-sm space-y-2 p-5">
				<h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Stock Price</h3>
				<p className="text-sm text-slate-600 dark:text-slate-300">Loading...</p>
			</div>
		);
	}

	const price = stockData?.price;
	const change = stockData?.change;
	const percent = stockData?.percent;
	const isPositive = typeof change === "number" ? change >= 0 : null;
	const changeClass = isPositive === null
		? "text-slate-600 dark:text-slate-300"
		: isPositive
			? "text-brand-green"
			: "text-brand-red";

	return (
		<div className="surface-card max-w-sm space-y-3 p-5">
			<h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Stock Price</h3>

			<div className="space-y-1 text-sm">
				<p className="text-slate-700 dark:text-slate-300">
					<span className="font-medium">Symbol:</span>{" "}
					<span className="font-semibold uppercase">{symbol || "N/A"}</span>
				</p>
				<p className="text-slate-700 dark:text-slate-300">
					<span className="font-medium">Current Price:</span> {formatValue(price)}
				</p>
				<p className={changeClass}>
					<span className="font-medium">Price Change:</span> {formatValue(change)}
				</p>
				<p className={changeClass}>
					<span className="font-medium">Percentage Change:</span> {formatValue(percent)}%
				</p>
			</div>
		</div>
	);
};

