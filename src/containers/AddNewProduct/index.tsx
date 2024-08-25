"use client";

import React, { useState } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PlusOutlined } from "@ant-design/icons";
import Input from "@/components/primitive/Input";
import { GetProp, Image, Upload, UploadFile, UploadProps, message } from "antd";
import Button from "@/components/primitive/Button";

const treeSchema = z.object({
  name: z.string().min(1, "Tree name is required"),
  scientificName: z.string().optional(),
  images: z.array(z.any()).min(1, "At least one image is required"),
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
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const methods = useForm({
    resolver: zodResolver(treeSchema),
    defaultValues: {
      images: [],
    },
  });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    const validFiles = newFileList.filter((file) =>
      ["image/jpeg", "image/png"].includes(file.type)
    );

    if (validFiles.length < newFileList.length) {
      message.error("Only JPG and PNG images are allowed.");
    }

    setImageFiles(validFiles);
    methods.setValue("images", validFiles);
    methods.trigger("images");
  };

  const onSubmit: SubmitHandler<typeof methods.getValues> = (data) => {
    if (imageFiles.length === 0) {
      message.error("At least one image is required.");
      return;
    }

    console.log("Form submitted successfully", data);
    // Proceed with your form submission logic
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

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
              <label className="block mb-1">Tree name:</label>
              <Input placeholder="Tree name" name="name" />
            </div>
            <div className="mt-4">
              <label className="block mb-1">Scientific name:</label>
              <Input placeholder="Scientific name" name="scientificName" />
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
              {methods.formState.errors.images && (
                <div className="text-red-500">
                  {methods.formState.errors.images.message}
                </div>
              )}
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
