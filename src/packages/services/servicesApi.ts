import { AxiosPromise, AxiosResponse } from "axios";
import axios from "./service";
import Cookies from "js-cookie";

interface IServiceResponse{
    message: string,
    success: boolean,
    services?: IService[]
    service?: IService
}

export const getAllServices = () => {
    const storeData: any = Cookies.get("Info");
    const { StoredToken } = JSON.parse(storeData);
    return axios.get('services', {
        headers: { 'Authorization': "Bearer " + StoredToken },
    });
}


export const createService = async (formData: FormData): Promise<IServiceResponse> => {
    const storeData: any = Cookies.get("Info");
    const { StoredToken } = JSON.parse(storeData);
    try {
        const response = await axios.post(`services`, formData, {
            headers: {
                'Authorization': "Bearer " + StoredToken,
                'content-type': 'multipart/form-data'
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating service:", error);
        throw error;
    }
};

export const deleteService = async (id: string): Promise<IServiceResponse> => {
    const storeData: any = Cookies.get("Info");
    if (!storeData) {
        throw new Error("No store data found in cookies");
    }

    const { StoredToken } = JSON.parse(storeData);
    if (!StoredToken) {
        throw new Error("No stored token found in cookies");
    }
    try {
        const res = await axios.delete(`services/${id}`, {
            headers: {
                'Authorization': "Bearer " + StoredToken,
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error creating service:", error);
        throw error;
    }
}

export const updateService = async (id: string, formData: FormData): Promise<IServiceResponse> => {
    const storeData: any = Cookies.get("Info");
    const { StoredToken } = JSON.parse(storeData);
    try {
        const response = await axios.put(`services/${id}`, formData, {
            headers: {
                'Authorization': "Bearer " + StoredToken,
                'Content-Type': 'multipart/form-data'
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error update service:", error);
        throw error;
    }
}
