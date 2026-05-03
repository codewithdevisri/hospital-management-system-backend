
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // ✅ MUST BE FIRST

import authRoutes from "./routes/authRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.json({ message: "Backend running ✅" });
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);

// start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});