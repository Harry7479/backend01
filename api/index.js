import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import db from "../utils/db.js";
import userRoutes from "../routes/user.routes.js";
import adminRoutes from "../routes/admin.routes.js";
import taskRoutes from "../routes/task.routes.js";


dotenv.config();

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(async (req, res, next) => {
  try {
    await db();
    next();
  } catch (err) {
    res.status(500).json({ message: "Database connection failed" });
  }
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/tasks", taskRoutes);




const port = process.env.PORT || 4000;
console.log("PORT from env:", process.env.PORT);

// app.listen(port, () => {
//   console.log(`App listening on port ${port}`);
// });

// for versel 
export default app;
