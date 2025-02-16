import React, { useState } from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { uploadImages } from "@/packages/services/uploadImages";

interface ImageUploadProps {
  value?: string;
  onChange?: (url: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange }) => {
  const [loading, setLoading] = useState(false);

  const customRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;
    setLoading(true);

    const formData = new FormData();
    formData.append("files", file);
    // Thêm upload preset và cloud name theo cấu hình của bạn trên Cloudinary
    formData.append("upload_preset", "your_upload_preset"); // Thay đổi theo cấu hình của bạn
    try {
      const res = await uploadImages(formData);
      const imageUrl = res.images[0];
      if (onChange) onChange(imageUrl);
      onSuccess("ok");
    } catch (error) {
      console.error("Upload error:", error);
      onError({ error });
      message.error("Có lỗi khi upload ảnh");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Upload
        customRequest={customRequest}
        showUploadList={false}
        accept="image/*"
      >
        <Button icon={<UploadOutlined />} loading={loading}>
          Upload Image
        </Button>
      </Upload>
      {value && (
        <div style={{ marginTop: 10 }}>
          <img src={value} alt="Uploaded" style={{ width: "100px" }} />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
