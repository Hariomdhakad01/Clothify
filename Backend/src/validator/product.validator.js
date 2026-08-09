import {body , validationResult } from "express-validator"

function validateRequest(req, res, next){
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({message: "Validation error",
            errors: errors.array(),
            success: false,
        })
    }
    next();
}
export const createProductValidator = [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("priceAmount").isFloat({ min: 1 }).withMessage("price amount is required"),
    body("priceCurrency").isIn(["USD", "INR", "EUR", "JPY", "GBP"]).withMessage("valid price currency is required"),
    validateRequest
]
