import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            default: "",
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        price: {
            amount: {
                type: Number,
                required: true,
            },
            currency: {
                type: String,
                default: "INR",
            },
        },
    },
    { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        line1: {
            type: String,
            required: true,
        },
        line2: {
            type: String,
            default: "",
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        postalCode: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            default: "India",
        },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        items: {
            type: [orderItemSchema],
            validate: {
                validator: (items) => items.length > 0,
                message: "Order requires at least one item",
            },
        },
        shippingAddress: {
            type: shippingAddressSchema,
            required: true,
        },
        total: {
            amount: {
                type: Number,
                required: true,
            },
            currency: {
                type: String,
                default: "INR",
            },
        },
        orderStatus: {
            type: String,
            enum: ["created", "paid", "processing", "shipped", "delivered", "cancelled"],
            default: "created",
        },
        payment: {
            provider: {
                type: String,
                enum: ["none", "razorpay"],
                default: "none",
            },
            status: {
                type: String,
                enum: ["not_required", "pending", "paid", "failed"],
                default: "not_required",
            },
            gatewayOrderId: String,
            gatewayPaymentId: String,
            gatewaySignature: String,
        },
    },
    { timestamps: true }
);

const orderModel = mongoose.model("order", orderSchema);

export default orderModel;
