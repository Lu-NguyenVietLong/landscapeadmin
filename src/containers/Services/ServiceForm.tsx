"use client";
import { Button, Input } from "antd";
import { isArray, map } from "lodash";
import { PlusCircle, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { uploadImages } from "@/packages/services/uploadImages";
import { updateService } from "@/packages/services/servicesApi";
import { toast } from "react-toastify";

import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { getFullImageUrl, removeBaseUrlImage } from "@/utils/helpers";
import { UploadChangeParam } from "antd/es/upload";

const BundledEditor = dynamic(
  () => import("@/components/primitive/BundledEditor"),
  {
    ssr: false,
  }
);

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

interface IProjectFieldList {
  name: string;
  images: File[];
}

interface IServiceProp {
  service: IService;
  onClose: () => void;
}

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const ServiceForm = ({ service, onClose }: IServiceProp) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(service?.title || "");
  const [message, setMessage] = useState(service?.message || "");
  const [images, setImages] = useState<any>([]);
  const [imagesList, setImagesList] = useState<any>([]);
  const [content, setContent] = useState(service?.content || "");
  const [policy, setPolicy] = useState(service?.policy || "");
  const [projectField, setProjectField] = useState<any>(
    service?.projects || []
  );
  const [projectFieldList, setProjectFieldList] = useState<any>(
    service?.projects || []
  );

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    setTitle(service?.title || "");
    setMessage(service?.message || "");
    setContent(service?.content || "");
    setPolicy(service?.policy || "");
    setProjectField(service?.projects || []);
    setImages(service?.images || []);
  }, [service]);
  useEffect(() => {
    if (service?.projects && service?.projects.length > 0) {
      const projects = service.projects.map((project) => {
        const images = project.images.map((image: string) => {
          return { url: getFullImageUrl(image) };
        });
        return {
          ...project,
          images: images,
        };
      });
      setProjectFieldList(projects);
    }
  }, [service?.projects]);
  useEffect(() => {
    let images = [];
    if (service?.images && service?.images.length > 0) {
      images = service.images.map((image: string) => ({
        url: getFullImageUrl(image),
      }));
      setImagesList(images);
    }
  }, [service?.images]);

  const editorRef = useRef(null);

  const handleChangeProjectField = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (isArray(projectField) && projectField.length !== 0) {
      const updatedProjectField: any = [...projectField];
      const { name, files, value: inputValue } = e.target;
      if (name === "name") {
        updatedProjectField[index][name] = inputValue;
      } else if (name === "images" && files) {
        updatedProjectField[index][name] = Array.from(files);
      }

      setProjectField(updatedProjectField);
    }
  };

  const handleAddField = () => {
    setProjectFieldList([...projectFieldList, { name: "", images: [] }]);
  };

  const handleDelteField = (index: number) => {
    const value = projectFieldList.filter(
      (_: any, idx: number) => idx !== index
    );
    setProjectFieldList(value);
  };

  const HandleUploadImages = async (file: any) => {
    const imageData = new FormData();
    imageData.append("files", file);
    const uploadRes = await uploadImages(imageData);
    if (uploadRes && uploadRes.images) {
      const imagesTemplate = images;
      imagesTemplate.push({ url: getFullImageUrl(uploadRes.images[0]) });
      setImages(imagesTemplate);
    }
  };

  // HANDLE SUBMIT FORM
  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Upload project images and collect promises
      const uploadImageProjectPromises = projectFieldList.map(
        async (project: any) => {
          const images = await Promise.all(
            project.images.map(async (image: any) => {
              if (image.thumbUrl) {
                const imgData = new FormData();
                imgData.append("files", image.originFileObj);
                const response = await uploadImages(imgData);
                if (response) {
                  return response.images[0];
                }
              } else {
                return removeBaseUrlImage(image.url);
              }
            })
          );

          return {
            ...project,
            images: images,
          };
        }
      );

      const updatedProjects = await Promise.all(uploadImageProjectPromises);

      // Upload other images and collect promises
      let imagesData: any[] = [];
      imagesData = imagesList
        .filter((item: any) => item.hasOwnProperty("url"))
        .map((item: any) => removeBaseUrlImage(item.url));
      const uploadPromises = imagesList.map(async (image: any) => {
        if (image.thumbUrl) {
          const imageData = new FormData();
          imageData.append("files", image.originFileObj);
          const response = await uploadImages(imageData);
          if (response) {
            imagesData.push(response.images[0]);
          }
        }
      });

      await Promise.all(uploadPromises);

      // Prepare the form data
      const data = new FormData();

      if (title) {
        data.set("title", title);
      }
      if (imagesData.length) {
        imagesData.forEach((images) => {
          data.append("images", images);
        });
      }

      if (message) {
        data.set("message", message);
      }

      if (content) {
        data.set("content", content);
      }

      if (policy) {
        data.set("policy", policy);
      }

      // Add updated project fields to the form data
      updatedProjects.forEach((project: any) => {
        data.append(
          "projects",
          JSON.stringify({
            name: project.name,
            images: project.images,
          })
        );
      });

      if (service) {
        const res = await updateService(service._id, data);
        if (res && res.success) {
          toast.success("Service updated successfully");
          onClose();
        } else {
          throw new Error("Failed to update service");
        }
      }

      setLoading(false);
    } catch (error) {
      setLoading(true);
      toast.error("Failed to update service");
    }
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setImagesList(newFileList);
  };

  const handleChangeProjectImg = (
    info: UploadChangeParam<UploadFile<any>>,
    index: number
  ) => {
    const { fileList: newFileList } = info; // Extract fileList from info

    setProjectFieldList((prev: IProjectFieldList[]) =>
      prev.map((project: IProjectFieldList, idx: number) => {
        if (index === idx) {
          return {
            ...project,
            images: newFileList,
          };
        }
        return project;
      })
    );
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <form className="mt-5 mx-auto">
      <div className="mb-3">
        <label className="text-second">Title:</label>
        <input
          type="text"
          placeholder="Title..."
          value={title}
          className="bg-slate-200 border-none outline-none py-3 w-full px-4 mt-1"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="text-second">Images:</label>
        <Upload
          listType="picture-card"
          fileList={imagesList}
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
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        )}
      </div>
      <div className="mb-3">
        <label className="text-second">Message:</label>
        <input
          type="text"
          value={message}
          placeholder="Message..."
          className="bg-slate-200 border-none outline-none py-3 w-full px-4 mt-1"
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="text-second">Content:</label>
        <div className="border p-2">
          <BundledEditor
            value={content}
            onEditorChange={(newValue: any, editor: any) => {
              setContent(newValue);
              // setContent(editor.getContent({ format: "text" }));
            }}
            onInit={(_evt: any, editor: any) => (editorRef.current = editor)}
          />
        </div>
      </div>
      <div className="mb-3">
        <label className="text-second">Policy:</label>
        <div className="border p-2">
          <BundledEditor
            value={policy}
            onEditorChange={(newValue: any, editor: any) => {
              setPolicy(newValue);
            }}
            onInit={(_evt: any, editor: any) => (editorRef.current = editor)}
          />
        </div>
      </div>
      <div className="mb-3">
        <label className="text-second mb-1">Projects:</label>
        {map(projectFieldList, (project, index: number) => (
          <div className="gap-2 mb-3" key={`project-${index}`}>
            <Input
              name="name"
              value={project.name}
              type="text"
              className="mb-1"
              onChange={(e) => handleChangeProjectField(index, e)}
            />
            <Upload
              listType="picture-card"
              fileList={project.images}
              onPreview={handlePreview}
              onChange={(info) => handleChangeProjectImg(info, index)}
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
                  afterOpenChange: (visible) => !visible && setPreviewImage(""),
                }}
                src={previewImage}
              />
            )}
            <div className="text-primary mt-1 w-full flex-center">
              <Trash2
                onClick={() => handleDelteField(index)}
                className="hover:text-black cursor-pointer"
              />
            </div>
          </div>
        ))}
        <div className="flex justify-center mt-4">
          <PlusCircle
            size={30}
            onClick={handleAddField}
            className="hover:text-black text-primary cursor-pointer"
          />
        </div>
      </div>
      <div className="flex justify-center mt-5">
        <Button loading={loading} onClick={handleSubmit}>
          Create
        </Button>
      </div>
    </form>
  );
};

export default ServiceForm;
