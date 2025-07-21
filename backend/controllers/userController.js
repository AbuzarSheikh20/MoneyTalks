import userModel from "../models/userModel.js";

export const getUserDetail = async (req, res) => {

  try {
    const { userID } = req.body;
    const user = await userModel.findById(userID);
    if (!user) {
      return res.json({ success: false, message: "User not found." });
    }

    return res.json({
      success: true,
      userData: {
        name: user.name,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Get user's income and categories
export const getIncomeCategories = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, income: user.income, categories: user.categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user's income and categories
export const updateIncomeCategories = async (req, res) => {
  try {
    const { income, categories } = req.body;
    const user = await userModel.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (typeof income === "number") user.income = income;
    if (Array.isArray(categories)) user.categories = categories;
    await user.save();
    res.json({ success: true, income: user.income, categories: user.categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
