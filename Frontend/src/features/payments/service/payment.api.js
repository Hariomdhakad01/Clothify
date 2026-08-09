import axios from "axios";

const paymentApiInstance = axios.create({
    baseURL: "/api/payments",
    withCredentials: true,
});

export async function getPaymentConfig() {
    const response = await paymentApiInstance.get("/config");
    return response.data;
}
