import express from "express";
import { isAuthenticated } from "../middleware/auth";
import {
    createOrderHandler,
    captureOrderHandler,
    getPremiumStatus,
} from "../controllers/payment.controller";

const router = express.Router();


router.get("/membership-status", isAuthenticated, getPremiumStatus);
router.post("/create-order", isAuthenticated, createOrderHandler);
router.post("/capture-order", isAuthenticated, captureOrderHandler);

export default router;
