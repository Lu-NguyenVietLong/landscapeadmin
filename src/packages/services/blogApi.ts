// src/api/blogApi.ts
import axios from "./service";
import Cookies from "js-cookie";
import { AxiosResponse } from "axios";
import { IBlog } from "../interfaces/blog.interface";

interface IServiceResponse {
  success: boolean;
  message: string;
  blog?: IBlog;
  blogs?: IBlog[];
  error?: string;
}

/** Lấy danh sách blog */
export const getBlogs = async (): Promise<IServiceResponse> => {
  try {
    const response: AxiosResponse<IServiceResponse> = await axios.get("blog");
    return response.data;
  } catch (error) {
    console.error("Error getting blogs:", error);
    throw error;
  }
};

/** Tạo mới blog */
export const createBlog = async (data: any): Promise<IServiceResponse> => {
  const storeData: any = Cookies.get("Info");
  const { StoredToken } = JSON.parse(storeData);
  try {
    const response: AxiosResponse<IServiceResponse> = await axios.post("blog", data, {
      headers: {
        Authorization: "Bearer " + StoredToken,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating blog:", error);
    throw error;
  }
};

/** Cập nhật blog theo ID */
export const updateBlog = async (id: string, data: any): Promise<IServiceResponse> => {
  const storeData: any = Cookies.get("Info");
  const { StoredToken } = JSON.parse(storeData);
  try {
    const response: AxiosResponse<IServiceResponse> = await axios.put(`blog/${id}`, data, {
      headers: {
        Authorization: "Bearer " + StoredToken,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating blog:", error);
    throw error;
  }
};

/** Xóa blog theo ID */
export const deleteBlog = async (id: string): Promise<IServiceResponse> => {
  const storeData: any = Cookies.get("Info");
  if (!storeData) throw new Error("No store data found in cookies");
  const { StoredToken } = JSON.parse(storeData);
  if (!StoredToken) throw new Error("No stored token found in cookies");
  try {
    const response: AxiosResponse<IServiceResponse> = await axios.delete(`blog/${id}`, {
      headers: {
        Authorization: "Bearer " + StoredToken,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw error;
  }
};
