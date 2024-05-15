import { IUser } from "../interfaces/user";
import axios from "./service";

interface LoginRequest {
    email: string,
    password: string
}

interface LoginResponse {
    message: string,
    success: boolean,
    token: string,
    user: IUser
}

export const loginApi = async ({email, password}: LoginRequest): Promise<LoginResponse> => {
    try {
        const res = await axios.post(`/auth/login`, { email, password },
        {
          headers: { "Content-Type": "application/json" },
        });
        return res
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
}