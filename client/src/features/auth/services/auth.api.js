import axios from "axios";

const api = axios.create({
    baseUrl: "http://localhost:3000",
    withCredentials: true,
})

export async function registerUser({name, email,phone,password,role}) {
    const response = await api.post("/api/auth/register",{name, email, phone, password, role})

    return response.data;
}

export async function loginUser({identifier, password, role}) {
    const response = await api.post("/api/auth/login",{identifier, password, role})

    return response.data;
}

export async function logoutUser() {
    const response = await api.post("/api/auth/logout")

    return response.data;
}


export async function getUser() {
    const response = await api.get("/api/auth/profile")
    return response.data;
}