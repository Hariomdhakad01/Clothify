import {setUser, setLoading, setError} from "../state/auth.slice.js";
import { register, login } from "../service/auth.api.js";
import { useDispatch, useSelector} from "react-redux";


export const useAuth = ()=>{
    const dispatch = useDispatch()

    const {user, loading, error} = useSelector(
        (state) => state.auth
    );

    async function handleRegister({ username, email, contact, password, isSeller = false}){
        dispatch(setLoading(true))
        dispatch(setError(null))

        try {
            const data  = await register({ email, contact, username, password, isSeller });
            dispatch(setUser(data.user))
            return data
        } catch (error) {
            const message = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || "Registration failed"
            dispatch(setError(message))
            throw new Error(message, { cause: error })
        } finally {
            dispatch(setLoading(false))
        }
    }
    
    async function handleLogin({ usernameOrEmail, password}){

        const data = await login({usernameOrEmail, password})
        dispatch(setUser(data.user))
    }




    return {handleRegister, user, loading, error, handleLogin}  
}

   