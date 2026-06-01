import axios from "axios";

const authApiInstance = axios.create({
    baseURL: "http://localhost:3000/api/auth",
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