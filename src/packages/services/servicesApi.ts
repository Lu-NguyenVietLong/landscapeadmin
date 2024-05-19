import { AxiosPromise, AxiosResponse } from "axios";
import axios from "./service";
import Cookies from "js-cookie";

interface IServiceResponse{
    message?: string,
    success?: boolean,
    services: IService[]
}

export const getAllServices = (): Promise<IServiceResponse> => {
    const storeData: any = Cookies.get("Info");
    const { StoredToken } = JSON.parse(storeData);
    return axios.get('services', {
        headers: { 'Authorization': "Bearer " + StoredToken },
    });
}

export const createService = ({ title, slug, images, message, content, policy, projects}: IService) => {
    return axios.post<IService>(`services`, { title, slug, images, message, content, policy, projects})
}