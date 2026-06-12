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
    
    /**
     * Handles the user login process.
     * Sets loading states, clears existing errors, sends authentication payload to API,
     * updates the Redux store with the logged-in user details, and handles any errors.
     * 
     * @param {Object} credentials - The login credentials.
     * @param {string} credentials.usernameOrEmail - The user's username or email.
     * @param {string} credentials.password - The user's password.
     */
    async function handleLogin({ usernameOrEmail, password }){
        // Start loading and clear any previous error in Redux store
        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            // Call the login API service
            const data = await login({ usernameOrEmail, password });
            // Save user details to Redux store on successful authentication
            dispatch(setUser(data.user));
            return data;
        } catch (error) {
            // Extract descriptive error message from server response or fallback to default
            const message = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || "Login failed";
            // Set the error message in Redux store to display in UI components
            dispatch(setError(message));
            // Re-throw to allow component-level handling
            throw new Error(message, { cause: error });
        } finally {
            // Stop loading state regardless of outcome
            dispatch(setLoading(false));
        }
    }

    return { handleRegister, user, loading, error, handleLogin }  
}


   
