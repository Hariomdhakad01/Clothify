import { createSlice } from "@reduxjs/toolkit";

const CART_KEY = "snitch_cart";

function loadCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
        return [];
    }
}

function saveCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
}

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: loadCart(),
    },
    reducers: {
        addToCart: (state, action) => {
            const product = action.payload;
            const existing = state.items.find((item) => item.productId === product._id);

            if (existing) {
                existing.quantity += 1;
            } else {
                state.items.push({
                    productId: product._id,
                    title: product.title,
                    image: product.images?.[0]?.url || "",
                    price: product.price,
                    quantity: 1,
                });
            }

            saveCart(state.items);
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter((item) => item.productId !== action.payload);
            saveCart(state.items);
        },
        updateQuantity: (state, action) => {
            const { productId, quantity } = action.payload;
            const item = state.items.find((cartItem) => cartItem.productId === productId);

            if (item) {
                item.quantity = Math.max(1, Number(quantity));
            }

            saveCart(state.items);
        },
        clearCart: (state) => {
            state.items = [];
            saveCart(state.items);
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
