import {setUser, setLoading, setError, setAuthChecked} from "../state/auth.slice.js";
import { register, login, getMe, logout } from "../service/auth.api.js";
import { useDispatch, useSelector} from "react-redux";

export const useAuth = ()=>{
    const dispatch = useDispatch()

    const {user, loading, error, authChecked} = useSelector(
        (state) => state.auth
    );

    async function handleRegister({ username, email, contact, password, isSeller = false}){
        dispatch(setLoading(true))
        dispatch(setError(null))

        try {
            const data  = await register({ email, contact, username, password, isSeller });
            dispatch(setUser(data.user))
            dispatch(setAuthChecked(true))
            return data
        } catch (error) {
            const message = error.response?.data?.errors?.[0]?.msg || error.response?.data?.message || "Registration failed"
            dispatch(setError(message))
            throw new Error(message, { cause: error })
        } finally {
            dispatch(setLoading(false))
        }
    }
    
    async function handleLogin({ usernameOrEmail, password }){
        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            const data = await login({ usernameOrEmail, password });
            dispatch(setUser(data.user));
            dispatch(setAuthChecked(true));
            return data;
        } catch (error) {
            const message = error.response?.data?.errors?.[0]?.msg || error.response?.data?.message || "Login failed";
            dispatch(setError(message));
            throw new Error(message, { cause: error });
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetMe(){
        try {
             dispatch(setLoading(true))
             const data = await getMe()
             dispatch(setUser(data.user))
             dispatch(setAuthChecked(true))
        } catch (error) {
            dispatch(setUser(null))
            console.log(error)
        }
       finally{
            dispatch(setAuthChecked(true))
            dispatch(setLoading(false))
       }
    }

    async function handleLogout(){
        await logout()
        dispatch(setUser(null))
        dispatch(setAuthChecked(true))
    }

    return { handleRegister, user, loading, error, authChecked, handleLogin, handleGetMe, handleLogout }  
}

