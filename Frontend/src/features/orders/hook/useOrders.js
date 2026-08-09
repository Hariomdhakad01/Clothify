import { useDispatch } from "react-redux";
import { createOrder, getMyOrders, getSellerOrders, verifyPayment } from "../service/order.api";
import { setOrderError, setOrderLoading, setOrders, setSellerOrders } from "../state/order.slice";

export function useOrders() {
    const dispatch = useDispatch();

    async function handleCreateOrder(payload) {
        dispatch(setOrderLoading(true));
        dispatch(setOrderError(null));

        try {
            return await createOrder(payload);
        } catch (error) {
            const message = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || "Order failed";
            dispatch(setOrderError(message));
            throw new Error(message, { cause: error });
        } finally {
            dispatch(setOrderLoading(false));
        }
    }

    async function handleGetMyOrders() {
        dispatch(setOrderLoading(true));
        dispatch(setOrderError(null));

        try {
            const data = await getMyOrders();
            dispatch(setOrders(data.orders));
            return data.orders;
        } catch (error) {
            const message = error.response?.data?.message || "Could not fetch orders";
            dispatch(setOrderError(message));
            throw new Error(message, { cause: error });
        } finally {
            dispatch(setOrderLoading(false));
        }
    }

    async function handleGetSellerOrders() {
        const data = await getSellerOrders();
        dispatch(setSellerOrders(data.orders));
        return data.orders;
    }

    async function handleVerifyPayment(payload) {
        return verifyPayment(payload);
    }

    return { handleCreateOrder, handleGetMyOrders, handleGetSellerOrders, handleVerifyPayment };
}
