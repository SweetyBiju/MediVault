import express from "express";
import multer from "multer";
import {
  handleTextBot,
  handleImageBot,
} from "../controllers/botController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/text", handleTextBot);
router.post("/image", upload.single("image"), handleImageBot);

export default router;
