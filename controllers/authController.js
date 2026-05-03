
import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ================= REGISTER =================
export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // ✅ check existing user
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // ✅ hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ insert user
    await pool.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully ✅" });

  } catch (err) {
    console.error("REGISTER ERROR:", err);

    res.status(500).json({
      message: "Server error during registration",
    });
  }
};

// ================= LOGIN =================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("LOGIN BODY:", req.body);

    // ✅ validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // ✅ find user
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = rows[0];

    // ✅ compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // ❗ CRITICAL FIX → ensure JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET missing in .env");
      return res.status(500).json({ message: "Server config error" });
    }

    // ✅ generate token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful ✅",
      token,
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);

    res.status(500).json({
      message: "Server error during login",
    });
  }
};