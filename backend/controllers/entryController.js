import Entry from "../models/entryModel.js";

// Create a new entry
export const createEntry = async (req, res) => {
  try {
    const { date, category, price, details } = req.body;
    const user = req.user.id;
    if (!date || !category || !price) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    const entry = new Entry({ user, date, category, price, details });
    await entry.save();
    res.status(201).json({ success: true, entry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all entries for the logged-in user (optionally filter by date/category)
export const getEntries = async (req, res) => {
  try {
    const user = req.user.id;
    const { date, category } = req.query;
    const filter = { user };
    if (date) filter.date = date;
    if (category && category !== "all") filter.category = category;
    const entries = await Entry.find(filter).sort({ date: -1, createdAt: -1 });
    res.json({ success: true, entries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update an entry (only if it belongs to the user)
export const updateEntry = async (req, res) => {
  try {
    const user = req.user.id;
    const { id } = req.params;
    const { date, category, price, details } = req.body;
    const entry = await Entry.findOneAndUpdate(
      { _id: id, user },
      { date, category, price, details },
      { new: true }
    );
    if (!entry) return res.status(404).json({ success: false, message: "Entry not found" });
    res.json({ success: true, entry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete an entry (only if it belongs to the user)
export const deleteEntry = async (req, res) => {
  try {
    const user = req.user.id;
    const { id } = req.params;
    const entry = await Entry.findOneAndDelete({ _id: id, user });
    if (!entry) return res.status(404).json({ success: false, message: "Entry not found" });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}; 