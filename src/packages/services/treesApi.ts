import { AxiosPromise, AxiosResponse } from "axios";
import axios from "./service";


export const getAllTree = () => {
    return axios.get(`trees`)
}