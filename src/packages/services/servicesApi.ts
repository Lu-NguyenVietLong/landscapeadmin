import { AxiosPromise, AxiosResponse } from "axios";
import axios from "./service";


export const getAllServices = () => {
    return axios.get(`services`)
}