"use client";

import React, { useState } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PlusOutlined } from "@ant-design/icons";
import Input from "@/components/primitive/Input";
import { GetProp, Image, Upload, UploadFile, UploadProps, message } from "antd";
import { uploadImages } from "@/packages/services/uploadImages";
import Button from "@/components/primitive/Button";

const treeSchema = z.object({
  name: z.string().min(1, "Tree name is required"),
  // scientificName: z.string().optional(),
  // sizes: z.array(
  //   z.object({
  //     size: z.string().min(1, "Kích thước là bắt buộc"),
  //     price: z.number().min(0, "Giá phải lớn hơn hoặc bằng 0"),
  //   })
  // ),
  // discount: z.number().min(0).max(100).optional(),
  // rating: z.number().min(0).max(5).optional(),
  // sold: z.number().min(0).optional(),
  imageUrl: z.array(z.string().url()).optional(),
  // description: z.string().min(1, "Mô tả là bắt buộc"),
  // careInstructions: z.string().min(1, "Hướng dẫn chăm sóc là bắt buộc"),
  // shipping: z.enum(["Freeship", "Standard", "Express"]).optional(),
  // isAvailable: z.boolean().optional(),
  // categories: z.array(z.string()).optional(),
  // basicInfo: z.object({
  //   light: z.string().min(1, "Ánh sáng là bắt buộc"),
  //   watering: z.string().min(1, "Tưới nước là bắt buộc"),
  //   environment: z.string().min(1, "Môi trường là bắt buộc"),
  //   tips: z.string().optional(),
  // }),
  // additionalInfo: z
  //   .object({
  //     height: z.string().optional(),
  //     toxicity: z.string().optional(),
  //     careLevel: z.string().optional(),
  //     potSize: z.string().optional(),
  //   })
  //   .optional(),
});

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const AddNewProduct = () => {
  const [imageFiles, setImageFiles] = useState<UploadFile[]>([]);
  const [imagesUrl, setImagesUrl] = useState<string[]>([]);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const methods = useForm({
    resolver: zodResolver(treeSchema),
  });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setImageFiles(newFileList);
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const handleImageUpload = async () => {
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    const uploadedUrls: string[] = [];
    for (const file of imageFiles) {
      if (!file.type || !validImageTypes.includes(file.type.toLowerCase())) {
        message.error(
          `Invalid file type for ${file.name}. Please upload an image.`
        );
        continue;
      }

      const formData = new FormData();
      formData.append("files", file.originFileObj as File);

      try {
        const response = await uploadImages(formData);
        console.log(response.images[0]);
        const url = response.images[0];
        uploadedUrls.push(url);
        message.success(`Image ${file.name} uploaded successfully!`);
      } catch (error) {
        message.error(`Failed to upload image ${file.name}`);
      }
    }

    setImagesUrl(uploadedUrls);
  };

  const onSubmit = async (data: any) => {
    console.log(data);
    await handleImageUpload();
    console.log("image url", imagesUrl);
  };

  return (
    <section className="relative">
      <div className="bg-white size-full shadow-box rounded-lg px-8 py-4">
        <h2 className="text-xl font-medium mt-5">Thêm cây mới</h2>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <div>
              <label className="block mb-1">Tên cây:</label>
              <Input placeholder="Tree name" name="name" />
            </div>
            <div>
              <label className="block mb-1">Upload Images:</label>
              <Upload
                listType="picture-card"
                fileList={imageFiles}
                onPreview={handlePreview}
                onChange={handleChange}
              >
                {uploadButton}
              </Upload>
              {previewImage && (
                <Image
                  alt=""
                  wrapperStyle={{ display: "none" }}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) =>
                      !visible && setPreviewImage(""),
                  }}
                  src={previewImage}
                />
              )}
            </div>
            <Button type="submit">
              <PlusOutlined /> Thêm cây mới
            </Button>
          </form>
        </FormProvider>
      </div>
    </section>
  );
};

export default AddNewProduct;
