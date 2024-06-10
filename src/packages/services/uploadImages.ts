import axios from "./service";
import Cookies from "js-cookie";

// interface IUploadImages {
//     images: File[]
// }

export const uploadImages = async (files: FormData) => {
    const storeData: any = Cookies.get("Info");
    const { StoredToken } = JSON.parse(storeData);
    try {
        const response = await axios.post(`uploadImages`, files, {
            headers: {
                'Authorization': "Bearer " + StoredToken,
                'content-type': 'multipart/form-data'
                // Do not set Content-Type; it will be set automatically by Axios
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating service:", error);
        throw error;
    }
}