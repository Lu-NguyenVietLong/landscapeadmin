"use client";

// import BundledEditor from "@/components/primitive/BundledEditor";
import Button from "@/components/primitive/Button";
import { createService } from "@/packages/services/servicesApi";
import { uploadImages } from "@/packages/services/uploadImages";
import { Input } from "antd";
import { map } from "lodash";
import { Plus, PlusCircle, Trash, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";

const BundledEditor = dynamic(
  () => import("@/components/primitive/BundledEditor"),
  {
    ssr: false,
  }
);

interface IAddService {
  onClose: () => void;
  addService: (props: IService) => void;
}

interface IProjectField {
  projectName: string;
  files: File[];
}

const AddService = ({ onClose, addService }: IAddService) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [contentValue, setContentValue] = useState("");
  const [policyValue, setPolicyValue] = useState("");
  const [projectField, setProjectField] = useState<IProjectField[]>([
    {
      projectName: "",
      files: [],
    },
  ]);

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
    const value = [...projectField];
    const { name, files, value: inputValue } = e.target;

    if (name === "projectName") {
      value[index][name] = inputValue;
    } else if (name === "files" && files) {
      value[index][name] = Array.from(files);
    }

    setProjectField(value);
  };

  const handleAddField = () => {
    setProjectField([...projectField, { projectName: "", files: [] }]);
  };

  const handleDelteField = (index: number) => {
    const value = projectField.filter((_, idx) => idx !== index);
    setProjectField(value);
  };

  const handleSubmit = async () => {
    const data = new FormData();
    const uploadPromises: any = [];

    projectField.forEach(async (project) => {
      const imageData = new FormData();
      project.files.forEach((file) => {
        imageData.append("files", file);
      });
      const uploadPromise = uploadImages(imageData).then((uploadRes) => {
        data.append(
          "projects",
          JSON.stringify({
            name: project.projectName,
            images: uploadRes.images,
          })
        );
      });
      console.log(project.projectName, project.files);
      uploadPromises.push(uploadPromise);
    });

    try {
      await Promise.all(uploadPromises); // Wait for all uploads to finish

      data.set("title", title);
      images.forEach((file) => {
        data.append("images", file);
      });
      data.set("message", message);
      data.set("content", contentValue);
      data.set("policy", policyValue);

      console.log("data projects", data.getAll("projects"));
      const res = await createService(data);
      if (res && res.success && res.service) {
        addService(res.service);
        toast.success("New service added successfully");
        onClose();
      }
    } catch (error) {
      toast.error("Failed to add new service");
    }
  };

  return (
    <form className="mt-5 mx-auto">
      <div className="mb-3">
        <label className="text-second">Title:</label>
        <input
          type="text"
          placeholder="Title..."
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
          placeholder="Message..."
          className="bg-slate-200 border-none outline-none py-3 w-full px-4 mt-1"
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="text-second">Content:</label>
        <div className="border p-2">
          <BundledEditor
            onEditorChange={(newValue: any, editor: any) => {
              setContentValue(newValue);
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
            onEditorChange={(newValue: any, editor: any) => {
              setPolicyValue(newValue);
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
              name="projectName"
              value={project.projectName}
              type="text"
              onChange={(e) => handleChangeProjectField(index, e)}
            />
            <Input
              onChange={(e) => handleChangeProjectField(index, e)}
              name="files"
              type="file"
            />
            <div className="text-primary flex items-center gap-2">
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
        <Button onClick={handleSubmit}>Create</Button>
      </div>
    </form>
  );
};

export default AddService;
