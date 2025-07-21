import mongoose from "mongoose";

const entrySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true }, // ISO date string (YYYY-MM-DD)
  category: { type: String, required: true },
  price: { type: Number, required: true },
  details: { type: String },
}, { timestamps: true });

const Entry = mongoose.model("Entry", entrySchema);
export default Entry; 