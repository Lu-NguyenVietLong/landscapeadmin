"use client";
import BundledEditor from "@/components/primitive/BundledEditor";
import Button from "@/components/primitive/Button";
import Modal from "@/components/primitive/Modal";
import { deleteService, getAllServices } from "@/packages/services/servicesApi";
import { map } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import AddService from "./AddService";
import { Space, Table } from "antd";
import { BadgePlus, SquarePen, Trash2 } from "lucide-react";

const Services = () => {
  const [services, setServices] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setloading] = useState(false);

  const HandleClose = () => {
    setIsOpen(false);
  };

  const handleDeleteBlog = async (id: string) => {
    try {
      const res = await deleteService(id);
      if (services) {
        setServices(services.filter((service: IService) => service._id !== id));
      }
    } catch (error) {
      console.log("Error->", error);
    }
  };

  useEffect(() => {
    const HandleService = async () => {
      try {
        setloading(true);
        const res = await getAllServices();
        if (res && res.services && res.services.length > 0) {
          console.log("res->", res.services);
          setServices(res.services);
        }
        setloading(false);
      } catch (error) {
        console.log("Error->", error);
      }
    };
    HandleService();
  }, []);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Action",
      key: "action",
      render: (service: IService) => (
        <Space size="middle">
          <Button>
            <SquarePen strokeWidth={0.75} />
            Edit
          </Button>
          <Button onClick={() => handleDeleteBlog(service._id)}>
            <Trash2 strokeWidth={0.75} /> Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <section className="relative">
      <div className="bg-white size-full shadow-box rounded-lg px-8 py-3">
        <h2 className="text-xl font-medium mt-5">Danh sách các dịch vụ</h2>
        <div className="flex justify-end mt-5 mb-3">
          <Button onClick={() => setIsOpen(true)}>
            {" "}
            <BadgePlus strokeWidth={0.75} /> Add new service
          </Button>
        </div>
        <div>
          <Table loading={loading} dataSource={services} columns={columns} />
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={HandleClose}>
        <h1 className="text-xl font-semibold">Add service</h1>
        <AddService />
      </Modal>
    </section>
  );
};

export default Services;
