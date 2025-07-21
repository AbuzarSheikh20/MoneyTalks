import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  createEntry,
  getEntries,
  updateEntry,
  deleteEntry,
} from "../controllers/entryController.js";

const router = express.Router();

router.post("/", userAuth, createEntry);
router.get("/", userAuth, getEntries);
router.put("/:id", userAuth, updateEntry);
router.delete("/:id", userAuth, deleteEntry);

export default router; 