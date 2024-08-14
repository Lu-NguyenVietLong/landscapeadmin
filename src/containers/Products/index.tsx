"use client";

import Button from "@/components/primitive/Button";
import { Modal, Space, Table } from "antd";
import { BadgePlus, SquarePen, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface IProductsPageProp {
  trees: ITree[];
}

const Products = ({ trees }: IProductsPageProp) => {
  const router = useRouter();

  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);

  const handleAddNewProductClick = () => {
    router.push("/products/add-new-product"); // Navigate to the desired page
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
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
          <Button>
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
          <Button onClick={handleAddNewProductClick}>
            <BadgePlus strokeWidth={0.75} /> Add new product
          </Button>
        </div>
        <div>
          <Table loading={false} dataSource={trees} columns={columns} />
        </div>
      </div>
    </section>
  );
};

export default Products;
