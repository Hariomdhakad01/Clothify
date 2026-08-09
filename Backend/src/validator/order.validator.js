import { body, validationResult } from "express-validator";

function validateRequest(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Validation error",
            errors: errors.array(),
            success: false,
        });
    }

    next();
}

export const createOrderValidator = [
    body("items").isArray({ min: 1 }).withMessage("At least one cart item is required"),
    body("items.*.productId").notEmpty().withMessage("Product id is required"),
    body("items.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
    body("shippingAddress.fullName").notEmpty().withMessage("Full name is required"),
    body("shippingAddress.phone").matches(/^\d{10}$/).withMessage("Phone must be 10 digits"),
    body("shippingAddress.line1").notEmpty().withMessage("Address line 1 is required"),
    body("shippingAddress.city").notEmpty().withMessage("City is required"),
    body("shippingAddress.state").notEmpty().withMessage("State is required"),
    body("shippingAddress.postalCode").notEmpty().withMessage("Postal code is required"),
    body("paymentProvider").optional().isIn(["none", "razorpay"]).withMessage("Invalid payment provider"),
    validateRequest,
];
