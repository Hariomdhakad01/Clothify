import axios from "axios";

const authApiInstance = axios.create({
    baseURL: "/api/auth",
    withCredentials: true
})


export async function register({username, email, contact, password, isSeller}){
    const response  = await authApiInstance.post("/register",{
        username,
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