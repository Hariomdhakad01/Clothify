import {createSlice} from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: "product",
    initialState:{
        sellerProducts:[],
        products:[],
        selectedProduct: null,
        loading: false,
        error: null,
    },
    reducers: {
        setSellerProducts: (state, action)=>{
            state.sellerProducts = action.payload
        },
        setProducts: (state, action)=>{
            state.products = action.payload
        },
        setSelectedProduct: (state, action)=>{
            state.selectedProduct = action.payload
        },
        setProductLoading: (state, action)=>{
            state.loading = action.payload
        },
        setProductError: (state, action)=>{
            state.error = action.payload
        }
    }
})

export const {setSellerProducts, setProducts, setSelectedProduct, setProductLoading, setProductError} = productSlice.actions
export default productSlice.reducer
