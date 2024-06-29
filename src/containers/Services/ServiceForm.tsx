"use client";
import BundledEditor from "@/components/primitive/BundledEditor";
import { Button, Input } from "antd";
import { map } from "lodash";
import { PlusCircle, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

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
  const [projectField, setProjectField] = useState(service?.projects);

  const editorRef = useRef(null);

  return (
    <form className="mt-5 w-[70%] mx-auto">
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
          // onChange={handleFileSelected}
        />
      </div>
      <div className="mb-3">
        <label className="text-second">Message:</label>
        <input
          type="text"
          value={message}
          placeholder="Message..."
          className="bg-slate-200 border-none outline-none py-3 w-full px-4 mt-1"
          //   onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="text-second">Content:</label>
        <div className="border p-2">
          <BundledEditor
            value={content}
            onEditorChange={(newValue: any, editor: any) => {
              setContent(newValue);
              //   setContent(editor.getContent({ format: "text" }));
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
        {/* {map(service.projects, (project, index) => (
          <div className="flex gap-2 mb-3" key={`project-${index}`}>
            <Input
              name="projectName"
              // value={project.name}
              type="text"
              //   onChange={(e) => handleChangeProjectField(index, e)}
            />
            <Input
              //   onChange={(e) => handleChangeProjectField(index, e)}
              name="files"
              type="file"
              // value={project.images}
            />
            <div className="text-primary flex items-center gap-2">
              <Trash2
                // onClick={() => handleDelteField(index)}
                className="hover:text-black cursor-pointer"
              />
            </div>
          </div>
        ))} */}
        <div className="flex justify-center mt-4">
          <PlusCircle
            size={30}
            // onClick={handleAddField}
            className="hover:text-black text-primary cursor-pointer"
          />
        </div>
      </div>
      <div className="flex justify-center mt-5">
        {/* <Button onClick={handleSubmit}>Create</Button> */}
      </div>
    </form>
  );
};

export default ServiceForm;
