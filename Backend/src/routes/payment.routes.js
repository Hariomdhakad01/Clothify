import express from "express";
import { getPaymentConfig } from "../controllers/payment.controller.js";

const paymentRouter = express.Router();

paymentRouter.get("/config", getPaymentConfig);

export default paymentRouter;
