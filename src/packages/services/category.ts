import axios from "./service";
import Cookies from "js-cookie";

interface ICategoryResponse {
  message: string;
  success: boolean;
  treesCategory?: any;
}

interface ICategoryStatusResponse {
    message: string;
    success: boolean;
  }

interface ICreateProp {
  name: string;
}

export const getCategories  = async () : Promise<ICategoryResponse> => {
  const response = await axios.get('tree-categories')
  return response.data;
};

export const createCategory = async (
  data: ICreateProp
): Promise<ICategoryResponse> => {
  const storeData: any = Cookies.get("Info");
  const { StoredToken } = JSON.parse(storeData);

  try {
    const response = await axios.post('tree-categories', data, {
      headers: {
        Authorization: "Bearer " + StoredToken,
       "Content-Type": "application/json",
      },
    });
    return response.data; 
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const updateCategory =  async (id: string ,data: ICreateProp) : Promise<ICategoryResponse> => {
    const storeData: any = Cookies.get("Info");
    const { StoredToken } = JSON.parse(storeData);
  
    try {
      const response = await axios.put(`tree-categories/${id}`, data, {
        headers: {
          Authorization: "Bearer " + StoredToken,
         "Content-Type": "application/json",
        },
      });
      return response.data; 
    } catch (error) {
      console.error("Error editing category:", error);
      throw error;
    }
}

export const deleteCategory = async (id: string): Promise<ICategoryStatusResponse> => {
    const storeData: any = Cookies.get("Info");
    const { StoredToken } = JSON.parse(storeData);
  
    try {
      const response = await axios.delete(`tree-categories/${id}`, {
        headers: {
          Authorization: "Bearer " + StoredToken,
         "Content-Type": "application/json",
        },
      });
      return response.data; 
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
}