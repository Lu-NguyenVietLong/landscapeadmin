"use client";
import { Button, Input } from "antd";
import { isArray, map } from "lodash";
import { PlusCircle, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadImages } from "@/packages/services/uploadImages";
import { updateService } from "@/packages/services/servicesApi";
import { toast } from "react-toastify";

const BundledEditor = dynamic(
  () => import("@/components/primitive/BundledEditor"),
  {
    ssr: false,
  }
);

interface IProjectField {
  projectName: string;
  files: File[];
}

interface IServiceForm {
  service: IService | undefined;
}

const ServiceForm = ({ service }: IServiceForm) => {
  const [title, setTitle] = useState(service?.title);
  const [message, setMessage] = useState(service?.message);
  const [images, setImages] = useState<File[]>([]);
  const [content, setContent] = useState(service?.content);
  const [policy, setPolicy] = useState(service?.policy);
  const [projectField, setProjectField] = useState<any>(
    service?.projects || []
  );

  const [test, setTest] = useState(3);

  useEffect(() => {
    setTitle(service?.title);
    setMessage(service?.message);
    setContent(service?.content);
    setPolicy(service?.policy);
    setProjectField(service?.projects || []);
  }, [service]);
  const editorRef = useRef(null);

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(files);
    }
  };

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
    setProjectField([...projectField, { projectName: "", files: [] }]);
  };

  const handleDelteField = (index: number) => {
    const value = projectField.filter((_: any, idx: number) => idx !== index);
    setProjectField(value);
  };

  // HANDLE SUBMIT FORM
  const handleSubmit = async () => {
    const uploadPromises: any = [];

    const data = new FormData();
    projectField.forEach((project: any) => {
      const imageData = new FormData();
      project.images.forEach((file: any) => {
        imageData.append("files", file);
      });
      const uploadPromise = uploadImages(imageData).then((uploadRes) => {
        data.append(
          "projects",
          JSON.stringify({
            name: project.name,
            images: uploadRes.images,
          })
        );
      });

      uploadPromises.push(uploadPromise);
    });

    try {
      await Promise.all(uploadPromises); // Wait for all uploads to finish

      if (title) {
        data.set("title", title);
      }
      images.forEach((file) => {
        data.append("images", file);
      });

      if (message) {
        data.set("message", message);
      }

      if (content) {
        data.set("content", content);
      }

      if (policy) {
        data.set("policy", policy);
      }
      if (service) {
        const res = await updateService(service?._id, data);
        if (res && res.success) {
          toast.success("New service added successfully");
        }
      }
    } catch (error) {
      toast.error("Failed to update service");
      console.log("Error->", error);
    }
  };

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
        <input
          className="ml-8"
          multiple
          type="file"
          onChange={handleFileSelected}
        />
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
              setContent(editor.getContent({ format: "text" }));
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
        <label className="text-second">Projects:</label>
        {map(projectField, (project, index) => (
          <div className="flex gap-2 mb-3" key={`project-${index}`}>
            <Input
              name="name"
              value={project.name}
              type="text"
              onChange={(e) => handleChangeProjectField(parseInt(index, 10), e)}
            />
            <Input
              onChange={(e) => handleChangeProjectField(parseInt(index, 10), e)}
              name="images"
              type="file"
              // value={project.images}
            />
            <div className="text-primary flex items-center gap-2">
              <Trash2
                onClick={() => handleDelteField(parseInt(index, 10))}
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
        <Button onClick={handleSubmit}>Create</Button>
      </div>
    </form>
  );
};

export default ServiceForm;
