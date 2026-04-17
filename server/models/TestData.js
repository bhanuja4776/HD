const mongoose = require("mongoose");

const testDataSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		message: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.models.TestData || mongoose.model("TestData", testDataSchema);
