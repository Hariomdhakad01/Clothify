import { createProduct, getAllProducts, getProductById, getSellerProduct} from "../service/product.api";
import { useDispatch } from "react-redux"
import { setProductError, setProductLoading, setProducts, setSelectedProduct, setSellerProducts } from "../state/product.slice";
import { fallbackProducts } from "../utils/fallbackProducts";

export const useProduct = ()=>{
    const dispatch = useDispatch()

    async function handleCreateProduct(formData){
        const data = await createProduct(formData)
        return data.product
    }

    async function handleGetSellerProduct(){
        const data = await getSellerProduct()
        dispatch(setSellerProducts(data.products))
        return data.products
    }

    async function handleGetAllProducts(){
        dispatch(setProductLoading(true))
        dispatch(setProductError(null))
        try {
            const data = await getAllProducts()
            dispatch(setProducts(data.products))
            return data.products
        } catch (error) {
            const message = error.response?.data?.message || "Could not fetch products"
            dispatch(setProductError(message))
            throw new Error(message, { cause: error })
        } finally {
            dispatch(setProductLoading(false))
        }
    }

    async function handleGetProductById(id){
        dispatch(setProductLoading(true))
        dispatch(setProductError(null))
        try {
            if (id && id.startsWith("sample-")) {
                const sampleProduct = fallbackProducts.find(p => p._id === id);
                if (sampleProduct) {
                    dispatch(setSelectedProduct(sampleProduct));
                    return sampleProduct;
                }
                throw new Error("Sample product not found");
            }
            const data = await getProductById(id)
            dispatch(setSelectedProduct(data.product))
            return data.product
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Could not fetch product"
            dispatch(setProductError(message))
            throw new Error(message, { cause: error })
        } finally {
            dispatch(setProductLoading(false))
        }
    }

    return {handleCreateProduct, handleGetSellerProduct, handleGetAllProducts, handleGetProductById}
}
