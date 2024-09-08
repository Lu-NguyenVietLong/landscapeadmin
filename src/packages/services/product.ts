import { AxiosPromise, AxiosResponse } from "axios";
import axios from "./service";
import Cookies from "js-cookie";

interface IServiceResponse {
    success: boolean,
    message: string,
    trees?: ITree | ITree[], 
    error?: string 
}

export const createTree = async (data: any): Promise<IServiceResponse> => {
    const storeData: any = Cookies.get("Info");
    const { StoredToken } = JSON.parse(storeData);
    try {
        const response = await axios.post(`trees`, data, {
            headers: {
                'Authorization': "Bearer " + StoredToken,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating service:", error);
        throw error;
    }
};

export const getTrees  = async () : Promise<IServiceResponse> => {
    const response = await axios.get('trees')
    return response.data;
};

export const updateTree =  async (id: string , data: ITree) : Promise<IServiceResponse> => {
    const storeData: any = Cookies.get("Info");
    const { StoredToken } = JSON.parse(storeData);
  
    try {
      const response = await axios.put(`trees/${id}`, data, {
        headers: {
          Authorization: "Bearer " + StoredToken,
        },
      });
      return response.data; 
    } catch (error) {
      console.error("Error editing category:", error);
      throw error;
    }
}

export const deleteTree = async (id: string): Promise<IServiceResponse> => {
    const storeData: any = Cookies.get("Info");
    if (!storeData) {
        throw new Error("No store data found in cookies");
    }

    const { StoredToken } = JSON.parse(storeData);
    if (!StoredToken) {
        throw new Error("No stored token found in cookies");
    }
    try {
        const res = await axios.delete(`trees/${id}`, {
            headers: {
                'Authorization': "Bearer " + StoredToken,
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error deleting service:", error);
        throw error;
    }
}