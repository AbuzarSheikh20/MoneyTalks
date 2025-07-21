import express from "express";
import { getUserDetail, getIncomeCategories, updateIncomeCategories } from "../controllers/userController.js";
import userAuth from "../middleware/userAuth.js";

const userRouter = express.Router();

userRouter.get("/data", userAuth, getUserDetail);
userRouter.get("/income-categories", userAuth, getIncomeCategories);
userRouter.put("/income-categories", userAuth, updateIncomeCategories);

export default userRouter;
