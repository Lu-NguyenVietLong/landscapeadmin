import { AxiosPromise, AxiosResponse } from "axios";
import axios from "./service";
import Cookies from "js-cookie";

interface IServiceResponse {
  success: boolean;
  message: string;
  categories?: IBlogCategory | IBlogCategory[];
  error?: string;
}

/**
 * Tạo mới một Blog Category.
 * Yêu cầu header Authorization (Bearer token) để xác thực.
 */
export const createBlogCategory = async (data: any): Promise<IServiceResponse> => {
  const storeData: any = Cookies.get("Info");
  const { StoredToken } = JSON.parse(storeData);
  try {
    const response: AxiosResponse<IServiceResponse> = await axios.post(
      `blog-category`,
      data,
      {
        headers: {
          Authorization: "Bearer " + StoredToken,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating blog category:", error);
    throw error;
  }
};

/**
 * Lấy danh sách tất cả các Blog Category.
 */
export const getBlogCategories = async (): Promise<IServiceResponse> => {
  try {
    const response: AxiosResponse<IServiceResponse> = await axios.get(`blog-category`);
    return response.data;
  } catch (error) {
    console.error("Error getting blog categories:", error);
    throw error;
  }
};

/**
 * Lấy chi tiết một Blog Category theo slug.
 */
export const getSingleBlogCategory = async (slug: string): Promise<IServiceResponse> => {
  try {
    const response: AxiosResponse<IServiceResponse> = await axios.get(`blog-category/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Error getting single blog category:", error);
    throw error;
  }
};

/**
 * Cập nhật một Blog Category theo ID.
 */
export const updateBlogCategory = async (
  id: string,
  data: IBlogCategory
): Promise<IServiceResponse> => {
  const storeData: any = Cookies.get("Info");
  const { StoredToken } = JSON.parse(storeData);
  try {
    const response: AxiosResponse<IServiceResponse> = await axios.put(
      `blog-category/${id}`,
      data,
      {
        headers: {
          Authorization: "Bearer " + StoredToken,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating blog category:", error);
    throw error;
  }
};

/**
 * Xóa một Blog Category theo ID.
 */
export const deleteBlogCategory = async (id: string): Promise<IServiceResponse> => {
  const storeData: any = Cookies.get("Info");
  if (!storeData) {
    throw new Error("No store data found in cookies");
  }
  const { StoredToken } = JSON.parse(storeData);
  if (!StoredToken) {
    throw new Error("No stored token found in cookies");
  }
  try {
    const response: AxiosResponse<IServiceResponse> = await axios.delete(
      `blog-category/${id}`,
      {
        headers: {
          Authorization: "Bearer " + StoredToken,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting blog category:", error);
    throw error;
  }
};
