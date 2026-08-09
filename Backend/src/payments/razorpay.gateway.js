import crypto from "crypto";
import Razorpay from "razorpay";
import { config } from "../config/config.js";

// RAZORPAY CODE START
const hasRazorpayKeys = Boolean(config.RAZORPAY_KEY_ID && config.RAZORPAY_KEY_SECRET);

const razorpayClient = hasRazorpayKeys
    ? new Razorpay({
        key_id: config.RAZORPAY_KEY_ID,
        key_secret: config.RAZORPAY_KEY_SECRET,
    })
    : null;

export function isRazorpayEnabled() {
    return config.PAYMENT_PROVIDER === "razorpay" && hasRazorpayKeys;
}

export function getRazorpayPublicConfig() {
    return {
        enabled: isRazorpayEnabled(),
        keyId: isRazorpayEnabled() ? config.RAZORPAY_KEY_ID : "",
        provider: "razorpay",
    };
}

export async function createRazorpayOrder({ amount, currency, receipt }) {
    if (!isRazorpayEnabled()) {
        return null;
    }

    return razorpayClient.orders.create({
        amount: Math.round(Number(amount) * 100),
        currency,
        receipt,
    });
}

export function verifyRazorpayPayment({ orderId, paymentId, signature }) {
    if (!isRazorpayEnabled()) {
        return false;
    }

    const expectedSignature = crypto
        .createHmac("sha256", config.RAZORPAY_KEY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest("hex");

    return expectedSignature === signature;
}
// RAZORPAY CODE END
