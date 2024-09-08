"use client";

import React, { useEffect, useState } from "react";
import {
  useForm,
  FormProvider,
  SubmitHandler,
  useFieldArray,
  Controller,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import Input from "@/components/primitive/Input";
import {
  Checkbox,
  GetProp,
  Image,
  Select,
  SelectProps,
  Upload,
  UploadFile,
  UploadProps,
  message,
} from "antd";
import Button from "@/components/primitive/Button";
import BundledEditor from "@/components/primitive/BundledEditor";
import { getCategories } from "@/packages/services/category";
import Textarea from "@/components/primitive/Textarea";
import { uploadImages } from "@/packages/services/uploadImages";
import { createTree } from "@/packages/services/product";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const treeSchema = z.object({
  name: z.string().min(1, "Tree name is required"),
  scientificName: z.string().optional(),
  imageUrl: z.array(z.any()).min(1, "At least one image is required"),
  sizes: z
    .array(
      z.object({
        size: z.string().min(1, "Size is required"),
        price: z.number().min(0, "Price must be a positive number"),
      })
    )
    .min(1, "At least one size is required"),
  discount: z.number().min(0, "Discount must be a positive number"),
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5")
    .default(0),
  sold: z.number().min(0, "Sold must be a non-negative number").default(0),
  description: z.string().min(1, "Description is required"),
  careInstructions: z.string(),
  isAvailable: z.boolean(),
  categories: z.array(z.string()).min(1, "Category is required"),
  basicInfo: z.object({
    light: z.string(), // Ánh sáng
    watering: z.string(), // Tưới nước
    environment: z.string(), // Môi trường
    tips: z.string(), // Mẹo hay
  }),
  additionalInfo: z.object({
    height: z.string(),
    toxicity: z.string(),
    careLevel: z.string(),
    potSize: z.string(),
  }),
});

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const formatVND = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

const AddNewProduct = () => {
  const [imageFiles, setImageFiles] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [editorDescription, setEditorDescription] = useState("");
  const [editorCareInstructions, setEditorCareInstructions] = useState("");
  const [categoriesId, setCategoriesId] = useState<SelectProps["options"]>([]);

  const router = useRouter();

  const methods = useForm({
    resolver: zodResolver(treeSchema),
    defaultValues: {
      imageUrl: [],
      sizes: [{ size: "", price: 0 }],
      description: editorDescription,
      careInstructions: editorCareInstructions,
      isAvailable: true,
      categories: [],
      basicInfo: {
        light: "",
        watering: "",
        environment: "",
        tips: "",
      },
      additionalInfo: {
        height: "",
        toxicity: "",
        careLevel: "",
        potSize: "",
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "sizes",
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
    methods.setValue("imageUrl", validFiles);
    methods.trigger("imageUrl");
  };

  const handleChangeCategory = (value: string[]) => {
    console.log(`selected ${value}`);
  };

  const onSubmit: SubmitHandler<typeof methods.getValues> = async (data) => {
    if (imageFiles.length === 0) {
      message.error("At least one image is required.");
      return;
    }

    let imageUrl = [];
    const imageData = new FormData();
    data.imageUrl.forEach(async (image) => {
      imageData.append("files", image.originFileObj);
    });
    const uploadPromise = await uploadImages(imageData);
    if (uploadPromise) {
      imageUrl = uploadPromise.images;
    }

    data = { ...data, imageUrl };

    const response = await createTree(data);

    if (response && response.success) {
      if (typeof window !== "undefined") {
        router.push("/products");
      }
      toast.success("Add service successfully");
    } else {
      toast.error("Failed to add service");
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const getAllCategories = async () => {
    const response = await getCategories();
    console.log(response);
    if (response.success) {
      let idList: SelectProps["options"] = [];
      response.treesCategory.forEach((category: ICategory) => {
        idList.push({ value: category._id, label: category.name });
      });
      setCategoriesId(idList);
    }
    console.log(categoriesId);
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <section className="relative pb-20">
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
              {methods.formState.errors.imageUrl && (
                <div className="text-red-500">
                  {methods.formState.errors.imageUrl.message}
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
            <div className="mt-4">
              <label className="block mb-1">Sizes:</label>
              {fields.map((field, index) => (
                <div key={field.id} className="flex space-x-4 mb-4">
                  <div>
                    <Input
                      placeholder="Size"
                      name={`sizes.${index}.size`}
                      defaultValue={field.size}
                    />
                    {methods.formState.errors.sizes?.[index]?.size && (
                      <div className="text-red-500">
                        {methods.formState.errors.sizes[index]?.size?.message}
                      </div>
                    )}
                  </div>
                  <div>
                    <Input
                      placeholder="Price"
                      name={`sizes.${index}.price`}
                      defaultValue={field.price}
                      type="number"
                    />
                    {methods.formState.errors.sizes?.[index]?.price && (
                      <div className="text-red-500">
                        {methods.formState.errors.sizes[index]?.price?.message}
                      </div>
                    )}
                  </div>
                  <i
                    className="cursor-pointer flex-center"
                    onClick={() => remove(index)}
                  >
                    <MinusCircleOutlined />
                  </i>
                </div>
              ))}
              <Button
                type="button"
                className="ml-[200px]"
                onClick={() => append({ size: "", price: 0 })}
              >
                <PlusOutlined />
              </Button>
            </div>
            <div className="mt-4 max-w-[250px]">
              <label className="block mb-1">Discount:</label>
              <Input type="number" placeholder="10%" name="discount" />
            </div>
            <div className="mt-4 max-w-[250px]">
              <label className="block mb-1">Rating:</label>
              <Input type="number" placeholder="5" name="rating" />
            </div>
            <div className="mt-4 max-w-[250px]">
              <label className="block mb-1">Sold:</label>
              <Input type="number" placeholder="324" name="sold" />
            </div>
            <div className="mt-4">
              <label className="block mb-1">Description:</label>
              <div className="px-16">
                <BundledEditor
                  value={editorDescription}
                  name="description"
                  onEditorChange={(newValue: any) => {
                    setEditorDescription(newValue);
                    methods.setValue("description", newValue);
                  }}
                />
                {methods.formState.errors.description && (
                  <div className="text-red-500">
                    {methods.formState.errors.description.message}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4">
              <label className="block mb-1">Care Instuctions:</label>
              <div className="px-16">
                <BundledEditor
                  value={editorCareInstructions}
                  name="careInstructions"
                  onEditorChange={(newValue: any) => {
                    setEditorCareInstructions(newValue);
                    methods.setValue("careInstructions", newValue);
                  }}
                />
                {methods.formState.errors.careInstructions && (
                  <div className="text-red-500">
                    {methods.formState.errors.careInstructions.message}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4">
              <Controller
                name="isAvailable"
                control={methods.control}
                defaultValue={true}
                render={({ field }) => (
                  <Checkbox
                    {...field}
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  >
                    <label className="block mb-1">Is Available</label>
                  </Checkbox>
                )}
              />
              {methods.formState.errors.isAvailable && (
                <div className="text-red-500">
                  {methods.formState.errors.isAvailable.message}
                </div>
              )}
            </div>
            <div className="mt-4">
              <label className="block mb-1">Category</label>

              <Controller
                name="categories"
                control={methods.control}
                render={({ field }) => (
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Please select categories"
                    onChange={(value) => field.onChange(value)}
                    options={categoriesId}
                  />
                )}
              />
              {methods.formState.errors.categories && (
                <div className="text-red-500">
                  {methods.formState.errors.categories.message}
                </div>
              )}
            </div>
            <div className="mt-8">
              <label className="block mb-1">Light:</label>
              <Textarea placeholder="Light" name="basicInfo.light" />
            </div>
            <div className="mt-4">
              <label className="block mb-1">Watering:</label>
              <Textarea placeholder="Watering" name="basicInfo.watering" />
            </div>
            <div className="mt-4">
              <label className="block mb-1">Environment:</label>
              <Textarea
                placeholder="Environment"
                name="basicInfo.environment"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-1">Tips:</label>
              <Textarea placeholder="Tips" name="additionalInfo.tips" />
            </div>

            <div className="mt-8">
              <label className="block mb-1">Height:</label>
              <Input placeholder="Height" name="additionalInfo.height" />
            </div>
            <div className="mt-4">
              <label className="block mb-1">Toxicity:</label>
              <Input placeholder="Toxicity" name="additionalInfo.toxicity" />
            </div>
            <div className="mt-4">
              <label className="block mb-1">Environment:</label>
              <Input placeholder="Care Level" name="additionalInfo.careLevel" />
            </div>
            <div className="mt-4">
              <label className="block mb-1">Pot Size:</label>
              <Input placeholder="Pot Size" name="additionalInfo.potSize" />
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
