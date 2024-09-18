"use client";

import Button from "@/components/primitive/Button";
import { Modal, Space, Table } from "antd";
import { BadgePlus, SquarePen, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import TreeForm from "./TreeForm";
import { deleteTree, getTrees } from "@/packages/services/product";
import { toast } from "react-toastify";

interface IProductsPageProp {
  trees?: ITree[] | undefined;
}

interface IFormType {
  type: "create" | "edit";
}

const Products = () => {
  const [openForm, setOpenForm] = useState(false);
  const [formType, setFormType] = useState<IFormType["type"]>("create");
  const [dataEdit, setDataEdit] = useState<ITree | null>();
  const [trees, setTrees] = useState<ITree[] | undefined>([]);

  const handleAddNewProductClick = () => {
    setFormType("create");
    setOpenForm(true);
  };

  const onSuccess = async () => {
    await handleGetTrees();
  };

  const handleOpenEditForm = (tree: ITree) => {
    setDataEdit(tree);
    setFormType("edit");
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setDataEdit(null);
  };

  const handleDeleteTree = async (tree: ITree) => {
    if (tree._id) {
      const response = await deleteTree(tree._id);
      if (response && response.success) {
        toast.success("Delete service successfully");
        await handleGetTrees();
      } else {
        toast.error("Failed to delete service");
      }
    }
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
      render: (tree: ITree) => (
        <Space size="middle">
          <Button onClick={() => handleOpenEditForm(tree)}>
            <SquarePen strokeWidth={0.75} />
            Edit
          </Button>
          <Button onClick={() => handleDeleteTree(tree)}>
            <Trash2 strokeWidth={0.75} /> Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleGetTrees = async () => {
    try {
      const { trees } = await getTrees();
      if (trees) {
        setTrees(Array.isArray(trees) ? trees : []);
      }
    } catch (error) {
      console.log("Error in get trees");
    }
  };

  useEffect(() => {
    handleGetTrees();
  }, []);

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
      <Modal
        width={800}
        open={openForm}
        onCancel={() => handleCloseForm()}
        footer={null}
      >
        <TreeForm
          onSuccess={onSuccess}
          type={formType}
          onClose={() => setOpenForm(false)}
          tree={{
            _id: dataEdit?._id ? dataEdit._id : "",
            name: dataEdit?.name ? dataEdit.name : "",
            scientificName: dataEdit?.scientificName
              ? dataEdit.scientificName
              : "",
            imageUrl: dataEdit?.imageUrl ? dataEdit.imageUrl : [],
            sizes: dataEdit?.sizes ? dataEdit.sizes : [{ size: "", price: 0 }],
            discount: dataEdit?.discount ? dataEdit.discount : 0,
            rating: dataEdit?.rating ? dataEdit.rating : 0,
            sold: dataEdit?.sold ? dataEdit.sold : 0,
            description: dataEdit?.description ? dataEdit.description : "",
            careInstructions: dataEdit?.careInstructions
              ? dataEdit.careInstructions
              : "",
            isAvailable: dataEdit?.isAvailable ? dataEdit.isAvailable : true,
            categories: dataEdit?.categories ? dataEdit.categories : [],
            basicInfo: {
              light: dataEdit?.basicInfo?.light ? dataEdit.basicInfo.light : "",
              watering: dataEdit?.basicInfo?.watering
                ? dataEdit.basicInfo.watering
                : "",
              environment: dataEdit?.basicInfo?.environment
                ? dataEdit.basicInfo.environment
                : "",
              tips: dataEdit?.basicInfo?.tips ? dataEdit.basicInfo.tips : "",
            },
            additionalInfo: {
              height: dataEdit?.additionalInfo?.height
                ? dataEdit.additionalInfo.height
                : "",
              toxicity: dataEdit?.additionalInfo?.toxicity
                ? dataEdit.additionalInfo.toxicity
                : "",
              careLevel: dataEdit?.additionalInfo?.careLevel
                ? dataEdit.additionalInfo.careLevel
                : "",
              potSize: dataEdit?.additionalInfo?.potSize
                ? dataEdit.additionalInfo.potSize
                : "",
            },
          }}
        />
      </Modal>
    </section>
  );
};

export default Products;
