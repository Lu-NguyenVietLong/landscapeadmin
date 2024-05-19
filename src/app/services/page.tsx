"use client";
import Button from "@/components/primitive/Button";
import Modal from "@/components/primitive/Modal";
import { getAllServices } from "@/packages/services/servicesApi";
import { map } from "lodash";
import React, { useEffect, useState } from "react";
import { EditorState } from "draft-js";
// import { Editor } from "react-draft-wysiwyg";
import dynamic from "next/dynamic";
const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const Page = () => {
  const [services, setServices] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const HandleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const HandleService = async () => {
      try {
        const res = await getAllServices();
        if (res && res.services && res.services.length > 0) {
          console.log("res->", res.services);
          setServices(res.services);
        }
      } catch (error) {
        console.log("Error->", error);
      }
    };
    HandleService();
  }, []);

  return (
    <section className="relative">
      <div className="bg-white px-8 py-2 rounded-2xl border">
        <h1 className="text-xl font-semibold">Dịch vụ</h1>
      </div>
      <div className="bg-white px-8 py-2 mt-2 rounded-2xl border">
        <h2 className="text-lg font-medium text-right">
          Danh sách các dịch vụ
        </h2>
        <div className="flex justify-end mt-5 mb-3">
          <Button onClick={() => setIsOpen(true)}>Add service</Button>
        </div>
        <div>
          <ul>
            {map(services, (service: IService, index) => {
              return <li key={index}>{service.title}</li>;
            })}
          </ul>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={HandleClose}>
        <h1 className="text-xl font-semibold">Add service</h1>
        <form className="mt-5 w-[70%] mx-auto">
          <div className="mb-3">
            <label className="text-second">Title:</label>
            <input
              type="text"
              placeholder="Title..."
              className="bg-slate-200 border-none outline-none py-3 w-full px-4 mt-1"
            />
          </div>
          <div className="mb-3">
            <label className="text-second">Images:</label>
            <input className="ml-8" type="file" />
          </div>
          <div className="mb-3">
            <label className="text-second">Message:</label>
            <input
              type="text"
              placeholder="Message..."
              className="bg-slate-200 border-none outline-none py-3 w-full px-4 mt-1"
            />
          </div>
          <div className="mb-3">
            <label className="text-second">Content:</label>
            <div className="border p-2">
              <Editor
                editorState={editorState}
                onEditorStateChange={setEditorState}
                placeholder="Blog..."
              />
            </div>
          </div>
        </form>
      </Modal>
    </section>
  );
};

export default Page;
