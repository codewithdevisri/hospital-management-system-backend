
import express from "express";
import { addPatient, getPatients } from "../controllers/patientController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, addPatient);
router.get("/", authMiddleware, getPatients);

export default router;