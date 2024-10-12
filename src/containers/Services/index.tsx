"use client";
import BundledEditor from "@/components/primitive/BundledEditor";
import Button from "@/components/primitive/Button";
// import Modal from "@/components/primitive/Modal";
import { deleteService, getAllServices } from "@/packages/services/servicesApi";
import { map } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import AddService from "./AddService";
import { Space, Table } from "antd";
import { BadgePlus, SquarePen, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import ServiceForm from "./ServiceForm";
import { Modal } from "antd";

const Services = () => {
  const [services, setServices] = useState<IService[]>([]);
  const [service, setService] = useState<IService>();
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [loading, setloading] = useState(false);

  const handleEdit = (service: IService) => {
    setService(service);
    console.log("set service", service);
    setIsOpenEdit(true);
  };

  const HandleClose = () => {
    setIsOpenAdd(false);
  };

  const handleAddSerive = (props: IService) => {
    setServices([...services, props]);
  };

  const handleDeleteBlog = async (id: string) => {
    try {
      const res = await deleteService(id);
      if (services && services?.length > 0 && res.success) {
        setServices(services.filter((service: IService) => service._id !== id));
        toast.success("Services deleted");
      }
    } catch (error) {
      toast.error("Failed to delete service");
      console.log("Error->", error);
    }
  };

  useEffect(() => {
    const HandleService = async () => {
      try {
        setloading(true);
        const res = await getAllServices();
        if (res && res.data.success) {
          console.log("res->", res.data);
          setServices(res.data.services);
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
          <Button onClick={() => handleEdit(service)}>
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
          <Button onClick={() => setIsOpenAdd(true)}>
            {" "}
            <BadgePlus strokeWidth={0.75} /> Add new service
          </Button>
        </div>
        <div>
          <Table loading={loading} dataSource={services} columns={columns} />
        </div>
      </div>
      <Modal width="100%" open={isOpenAdd} onCancel={HandleClose}>
        <h1 className="text-xl font-semibold">Add service</h1>
        <AddService
          onClose={HandleClose}
          addService={(props: IService) => handleAddSerive(props)}
        />
      </Modal>
      <Modal
        width="100%"
        open={isOpenEdit}
        onCancel={() => setIsOpenEdit(!isOpenEdit)}
        footer={null}
      >
        {service && (
          <ServiceForm service={service} onClose={() => setIsOpenEdit(false)} />
        )}
      </Modal>
      <section>{/* <ServiceForm /> */}</section>
    </section>
  );
};

export default Services;
