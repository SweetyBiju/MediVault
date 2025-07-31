import express from "express";
import { getAllDoctors } from "../controllers/doctor.controller.js";  // <-- correct file name
const router = express.Router();

router.get("/doctors", (req, res, next) => {
  console.log("GET /api/doctors hit"); // Debug log
  getAllDoctors(req, res, next);
});

export default router;
