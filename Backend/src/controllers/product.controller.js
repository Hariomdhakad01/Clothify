import productModel from "../models/product.model.js"
import { uploadFile } from "../services/storage.service.js";

export async function createProduct(req, res){
    try {
        const {title, description, priceAmount, priceCurrency} = req.body;
        const seller = req.user;
        const files = req.files || [];

        const images = await Promise.all(files.map(async (file)=>{
            return await uploadFile({
                buffer: file.buffer,
                fileName: file.originalname
            })
        }))

        const product = await productModel.create({
            title,
            description,
            price: {
                amount: Number(priceAmount),
                currency: priceCurrency || "INR"
            },
            images,
            seller: seller._id
        })

        res.status(201).json({
            message: "Product created successfully",
            success: true,
            product
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Failed to create product",
            success: false
        })
    }
}

export async function getSellerProducts(req, res){
    const seller = req.user;

    const products = await productModel.find({seller: seller._id}).sort({ createdAt: -1 });

    res.status(200).json({
        message: "Products fetched successfully",
        success: true,
        products
    })
}

export async function getAllProducts(req, res){
    const products = await productModel.find().populate("seller", "username").sort({ createdAt: -1 })

    return res.status(200).json({
        message: "Products fetched Successfully",
        success: true,
        products
    })
}

export async function getProductById(req, res){
    const product = await productModel.findById(req.params.id).populate("seller", "username email")

    if(!product){
        return res.status(404).json({
            message: "Product not found",
            success: false,
        })
    }

    return res.status(200).json({
        message: "Product fetched Successfully",
        success: true,
        product
    })
}
