import axios from "axios";

const orderApiInstance = axios.create({
    baseURL: "/api/orders",
    withCredentials: true,
});

export async function createOrder(payload) {
    const response = await orderApiInstance.post("/", payload);
    return response.data;
}

export async function getMyOrders() {
    const response = await orderApiInstance.get("/my");
    return response.data;
}

export async function getSellerOrders() {
    const response = await orderApiInstance.get("/seller");
    return response.data;
}

export async function verifyPayment({ orderId, paymentResponse }) {
    const response = await orderApiInstance.post(`/${orderId}/verify-payment`, paymentResponse);
    return response.data;
}
