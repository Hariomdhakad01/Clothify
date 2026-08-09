function loadScript(src) {
    return new Promise((resolve, reject) => {
        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (existingScript) {
            resolve(true);
            return;
        }

        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve(true);
        script.onerror = () => reject(new Error("Unable to load payment gateway"));
        document.body.appendChild(script);
    });
}

// RAZORPAY CODE START
export async function startRazorpayCheckout({ payment, user, shippingAddress }) {
    await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    return new Promise((resolve, reject) => {
        const razorpay = new window.Razorpay({
            key: payment.keyId,
            amount: payment.amount,
            currency: payment.currency,
            name: "Snitch Studio",
            description: "Snitch order checkout",
            order_id: payment.orderId,
            prefill: {
                name: shippingAddress.fullName || user?.username || "",
                email: user?.email || "",
                contact: shippingAddress.phone || user?.contact || "",
            },
            theme: {
                color: "#0f766e",
            },
            handler: (response) => resolve(response),
            modal: {
                ondismiss: () => reject(new Error("Payment cancelled")),
            },
        });

        razorpay.open();
    });
}
// RAZORPAY CODE END
