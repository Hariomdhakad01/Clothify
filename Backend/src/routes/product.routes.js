import express from "express";
import { authenticateSeller } from "../middlewares/auth.middleware.js";
import { createProduct, getAllProducts, getProductById, getSellerProducts } from "../controllers/product.controller.js";
import multer from "multer";
import { createProductValidator } from "../validator/product.validator.js";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 
    }
})

const prodRouter = express.Router()

prodRouter.post("/",authenticateSeller,upload.array('images', 7),createProductValidator,createProduct)
prodRouter.get("/seller", authenticateSeller, getSellerProducts)
prodRouter.get("/:id", getProductById)
prodRouter.get("/", getAllProducts)

export default prodRouter;
