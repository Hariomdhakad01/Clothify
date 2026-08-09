import axios from "axios";

const authApiInstance = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api/auth`,
    withCredentials: true
})

export async function register({username, email, contact, password, isSeller}){
    const response  = await authApiInstance.post("/register",{
        username,
        name: username,
        email,
        contact,
        password,
        isSeller
    })

    return response.data
}

export async function login({usernameOrEmail, password}){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmail = emailRegex.test(usernameOrEmail)
    const payload = {password}

    if(isEmail){
        payload.email = usernameOrEmail
    }
    else{
        payload.username = usernameOrEmail
    }

    const response = await authApiInstance.post("/login", payload )
    return response.data
}

export async function getMe(){
    const response = await authApiInstance.get("/me")
    return response.data
}

export async function logout(){
    const response = await authApiInstance.post("/logout")
    return response.data
}

