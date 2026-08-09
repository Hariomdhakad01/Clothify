import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
    name: "orders",
    initialState: {
        orders: [],
        sellerOrders: [],
        loading: false,
        error: null,
    },
    reducers: {
        setOrders: (state, action) => {
            state.orders = action.payload;
        },
        setSellerOrders: (state, action) => {
            state.sellerOrders = action.payload;
        },
        setOrderLoading: (state, action) => {
            state.loading = action.payload;
        },
        setOrderError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setOrders, setSellerOrders, setOrderLoading, setOrderError } = orderSlice.actions;
export default orderSlice.reducer;
