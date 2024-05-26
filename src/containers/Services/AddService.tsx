"use client";

import BundledEditor from "@/components/primitive/BundledEditor";
import Button from "@/components/primitive/Button";
import { createService } from "@/packages/services/servicesApi";
import React, { useRef, useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";

const AddService = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [contentValue, setContentValue] = useState("");
  const [policyValue, setPolicyValue] = useState("");

  const editorRef = useRef(null);

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(files);
      console.log("files: " + files);
    }
  };

  const handleSubmit = async () => {
    const data = new FormData();
    data.set("title", title);
    images.forEach((file, index) => {
      data.append(`images`, file);
    });
    data.set("slug", "slg-test");
    data.set("message", message);
    data.set("content", contentValue);
    data.set("policy", policyValue);
    console.log("content", data);
    const res = await createService(data);
  };

  // const handleSubmit = async () => {
  //   try {
  //     const res = await createService({
  //       title,
  //       slug: "test-slug",
  //       images,
  //       message,
  //       content: contentValue,
  //       policy: policyValue,
  //     }); // Ensure your createService function handles FormData
  //     console.log("create", res);
  //   } catch (error) {
  //     console.error("Error creating service:", error);
  //   }
  // };

  //   form
  // const formSchema = z.object({
  //   title: z.string(),
  //   images: z.array(z.string()),
  //   message: z.string(),
  //   content: z.string(),
  //   policy: z.string(),
  //   projects: z.array(
  //     z.object({ name: z.string(), images: z.array(z.string()) })
  //   ),
  // });

  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   mode: "onChange",
  //   defaultValues: {
  //     title: "",
  //     images: [],
  //     message: "",
  //     content: "",
  //     policy: "",
  //     projects: [{ name: "", images: [] }],
  //   },
  // });

  return (
    <form className="mt-5 w-[70%] mx-auto">
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
        <div className="flex items-center gap-[10%]">
          <input
            type="text"
            placeholder="Project name..."
            className="bg-slate-200 w-[45%] border-none outline-none py-3 px-4 mt-1"
          />
          <input type="file" className="w-[45%]" />
        </div>
      </div>
      <div className="flex justify-center mt-5">
        <Button onClick={handleSubmit}>Create</Button>
      </div>
    </form>
  );
};

export default AddService;
