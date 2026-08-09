import {createBrowserRouter} from "react-router"
import Register from "../features/auth/pages/Register"
import Login from "../features/auth/pages/Login"
import CreateProduct from "../features/products/pages/CreateProduct"
import Dashboard from "../features/products/pages/Dashboard"
import Protected from "../features/auth/components/Protected"
import Home from "../features/products/pages/Home"
import ProductDetail from "../features/products/pages/ProductDetail"
import Cart from "../features/cart/pages/Cart"
import Checkout from "../features/orders/pages/Checkout"
import Orders from "../features/orders/pages/Orders"

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <Home />
    },
    {
        path: "/products/:id",
        element: <ProductDetail />
    },
    {
        path: "/cart",
        element: <Cart />
    },
    {
        path: "/checkout",
        element: <Protected role="buyer"><Checkout /></Protected>
    },
    {
        path: "/orders",
        element: <Protected role="buyer"><Orders /></Protected>
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: "/seller/create-product",
        element: <Protected role="seller"><CreateProduct/></Protected>  
    },
    {
        path: "/seller/dashboard",
        element: <Protected role="seller"><Dashboard/></Protected>
    },
])
