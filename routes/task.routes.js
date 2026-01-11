import express from "express";
import {
  createTask,
  getMyTasks,
  updateTask,
  deleteTask,
} from "../controller/task.controller.js";

import { isLoggedIn } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", isLoggedIn, createTask);
router.get("/", isLoggedIn, getMyTasks);
router.put("/:id", isLoggedIn, updateTask);
router.delete("/:id", isLoggedIn, deleteTask);

export default router;
