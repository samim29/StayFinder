import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
})

/**
 * @description register user service
 * @param {Object} userData - The user data for registration.
 * @return {Promise<Object>} - The response data from the server.
 */
export async function registerUser({name, email,phone,password,role}) {
    const response = await api.post("/api/auth/register",{name, email, phone, password, role})

    return response.data;
}

/**
 * @description login user service
 * @param {Object} loginData - The login data containing identifier and password.
 * @return {Promise<Object>} - The response data from the server.
 */
export async function loginUser({identifier, password, role}) {
    const response = await api.post("/api/auth/login",{identifier, password, role})

    return response.data;
}

/**
 * @description logout user service
 * @return {Promise<Object>} - The response data from the server.
 */
export async function logoutUser() {
    const response = await api.post("/api/auth/logout")

    return response.data;
}

/**
 * @description get user profile service
 * @return {Promise<Object>} - The response data from the server.
 */
export async function getUser() {
    const response = await api.get("/api/auth/profile")
    return response.data;
}