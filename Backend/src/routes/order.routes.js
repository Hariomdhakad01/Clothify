import express from "express";
import { authenticateSeller, authenticateUser } from "../middlewares/auth.middleware.js";
import {
    createOrder,
    getMyOrders,
    getSellerOrders,
    verifyOrderPayment,
} from "../controllers/order.controller.js";
import { createOrderValidator } from "../validator/order.validator.js";

const orderRouter = express.Router();

orderRouter.post("/", authenticateUser, createOrderValidator, createOrder);
orderRouter.get("/my", authenticateUser, getMyOrders);
orderRouter.get("/seller", authenticateSeller, getSellerOrders);
orderRouter.post("/:id/verify-payment", authenticateUser, verifyOrderPayment);

export default orderRouter;
