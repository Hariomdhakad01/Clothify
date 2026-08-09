import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: {
        type:String,
        required: true
    },
    description: {
        type:String,
        required: true
    },
    seller:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    price: {
        amount: {
            type: Number,
            required: true,
            min: 1
        },
        currency: {
            type:String,
            enum:["USD", "INR", "EUR", "JPY", "GBP"],
            default: "INR"
        }
    },
    images: [
        {
            url: {
                type: String,
                required: true
            }
        }
    ],
    variants: [
        {
            attributes: {
                type: Map,
                of: String
            },
            stock: {
                type: Number,
                required: true,
                default: 0
            },
            price: {
                type: Number,
                required: false
            },
            images: [
                {
                    url: {
                        type: String,
                        required: true
                    }
                }
            ]
        }
    ]
}, {timestamps: true})

const productModel = mongoose.model("product", productSchema);

export default productModel;
