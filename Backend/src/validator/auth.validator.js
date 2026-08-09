import { body, validationResult } from "express-validator";

export function validate(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array()[0].msg,
            errors: errors.array(),
            success: false,
        })
    }

    next()
}

export const registerValidationRules = [
    body("username")
        .customSanitizer((value, { req }) => value || req.body.name)
        .trim()
        .notEmpty().withMessage("Name is required")
        .isString().withMessage("Name must be a string")
        .isLength({ min: 3, max: 30 }).withMessage("Name must be between 3 and 30 characters"),
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format"),
    body("contact")
        .trim()
        .notEmpty().withMessage("Contact is required")
        .matches(/^\d{10}$/).withMessage("Contact must be exactly 10 digits"),
    body("password")
        .notEmpty().withMessage("Password is required")
        .isString().withMessage("Password must be a string")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body("isSeller")
        .isBoolean().withMessage("isSeller must be boolean value"),
    validate
]

export const  loginValidationRules = [
    body("email")
        .optional()
        .trim()
        .isEmail().withMessage("Invalid email format"),
    body("password")
        .notEmpty().withMessage("password is required"),
    body("username")
        .optional()
        .trim()
        .isString().withMessage("Username must be a string")
        .isLength({ min: 3, max: 15 }).withMessage("Username must be between 3 and 15 characters")
        .custom((value) => {
            if (/^\d{10}$/.test(value)) {
                throw new Error("Login using contact number is not allowed. Please use username or email.");
            }
            return true;
        }),
    validate
]

