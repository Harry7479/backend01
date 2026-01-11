import express from "express";
import { isLoggedIn } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";

const router = express.Router();

// Admin-only protected route
router.get("/admin-dashboard", isLoggedIn, isAdmin, (req, res) => {
  res.json({
    success: true,
    message: "Welcome Admin",
    admin: req.user,
  });
});

export default router;
