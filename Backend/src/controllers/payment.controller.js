import { getRazorpayPublicConfig } from "../payments/razorpay.gateway.js";

export function getPaymentConfig(req, res) {
    return res.status(200).json({
        message: "Payment config fetched successfully",
        success: true,
        // RAZORPAY CODE START - frontend only receives public Razorpay data.
        razorpay: getRazorpayPublicConfig(),
        // RAZORPAY CODE END
    });
}
