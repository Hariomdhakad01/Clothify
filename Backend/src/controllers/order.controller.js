import orderModel from "../models/order.model.js";
import productModel from "../models/product.model.js";
import {
    createRazorpayOrder,
    getRazorpayPublicConfig,
    isRazorpayEnabled,
    verifyRazorpayPayment,
} from "../payments/razorpay.gateway.js";

function normaliseItems(items = []) {
    return items
        .map((item) => ({
            productId: item.productId || item.product,
            quantity: Number(item.quantity || 1),
        }))
        .filter((item) => item.productId && item.quantity > 0);
}

export async function createOrder(req, res) {
    try {
        const buyer = req.user;
        const { items, shippingAddress, paymentProvider = "none" } = req.body;
        const normalisedItems = normaliseItems(items);

        if (normalisedItems.length === 0) {
            return res.status(400).json({
                message: "Order must include at least one product",
                success: false,
            });
        }

        const productIds = normalisedItems.map((item) => item.productId);
        const products = await productModel.find({ _id: { $in: productIds } });
        const productMap = new Map(products.map((product) => [product._id.toString(), product]));

        if (products.length !== productIds.length) {
            return res.status(404).json({
                message: "One or more products could not be found",
                success: false,
            });
        }

        const currency = products[0].price.currency || "INR";
        const orderItems = normalisedItems.map((item) => {
            const product = productMap.get(item.productId.toString());

            if (product.price.currency !== currency) {
                throw new Error("All products in one order must use the same currency");
            }

            return {
                product: product._id,
                title: product.title,
                image: product.images?.[0]?.url || "",
                quantity: item.quantity,
                price: {
                    amount: product.price.amount,
                    currency,
                },
            };
        });

        const totalAmount = orderItems.reduce(
            (sum, item) => sum + item.price.amount * item.quantity,
            0
        );

        const shouldUseRazorpay = paymentProvider === "razorpay" && isRazorpayEnabled();

        const order = await orderModel.create({
            buyer: buyer._id,
            items: orderItems,
            shippingAddress,
            total: {
                amount: totalAmount,
                currency,
            },
            payment: {
                provider: shouldUseRazorpay ? "razorpay" : "none",
                status: shouldUseRazorpay ? "pending" : "not_required",
            },
        });

        let paymentOrder = null;

        // RAZORPAY CODE START - order creation is delegated to the isolated gateway file.
        if (shouldUseRazorpay) {
            paymentOrder = await createRazorpayOrder({
                amount: totalAmount,
                currency,
                receipt: `snitch_${order._id}`,
            });

            order.payment.gatewayOrderId = paymentOrder.id;
            await order.save();
        }
        // RAZORPAY CODE END

        return res.status(201).json({
            message: "Order created successfully",
            success: true,
            order,
            payment: paymentOrder
                ? {
                    provider: "razorpay",
                    orderId: paymentOrder.id,
                    amount: paymentOrder.amount,
                    currency: paymentOrder.currency,
                    keyId: getRazorpayPublicConfig().keyId,
                }
                : {
                    provider: "none",
                },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "Failed to create order",
            success: false,
        });
    }
}

export async function getMyOrders(req, res) {
    const orders = await orderModel
        .find({ buyer: req.user._id })
        .populate("items.product")
        .sort({ createdAt: -1 });

    return res.status(200).json({
        message: "Orders fetched successfully",
        success: true,
        orders,
    });
}

export async function getSellerOrders(req, res) {
    const products = await productModel.find({ seller: req.user._id }).select("_id");
    const productIds = products.map((product) => product._id);

    const orders = await orderModel
        .find({ "items.product": { $in: productIds } })
        .populate("buyer", "username email contact")
        .sort({ createdAt: -1 });

    return res.status(200).json({
        message: "Seller orders fetched successfully",
        success: true,
        orders,
    });
}

export async function verifyOrderPayment(req, res) {
    try {
        const { id } = req.params;
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const order = await orderModel.findOne({ _id: id, buyer: req.user._id });

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                success: false,
            });
        }

        // RAZORPAY CODE START - payment signature verification is isolated here.
        const isValid = verifyRazorpayPayment({
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            signature: razorpay_signature,
        });
        // RAZORPAY CODE END

        if (!isValid || order.payment.gatewayOrderId !== razorpay_order_id) {
            order.payment.status = "failed";
            await order.save();

            return res.status(400).json({
                message: "Payment verification failed",
                success: false,
            });
        }

        order.payment.status = "paid";
        order.payment.gatewayPaymentId = razorpay_payment_id;
        order.payment.gatewaySignature = razorpay_signature;
        order.orderStatus = "paid";
        await order.save();

        return res.status(200).json({
            message: "Payment verified successfully",
            success: true,
            order,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to verify payment",
            success: false,
        });
    }
}
