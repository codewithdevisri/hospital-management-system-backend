
import pool from "../config/db.js";

export const addPatient = async (req, res) => {
  try {
    const { patient_name, bed_id } = req.body;

    await pool.query(
      "INSERT INTO patients (user_id, patient_name, bed_id) VALUES (?, ?, ?)",
      [req.user.id, patient_name, bed_id]
    );

    res.json({ message: "Patient added" });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getPatients = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM patients WHERE user_id = ?",
      [req.user.id]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
};