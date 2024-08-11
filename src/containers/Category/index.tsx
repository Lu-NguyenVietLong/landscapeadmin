"use client";
import Button from "@/components/primitive/Button";
import Input from "@/components/primitive/Input";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/packages/services/category";
import { Modal, Space, Table } from "antd";
import { BadgePlus, SquarePen, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type FormData = z.infer<typeof formSchema>;

const Categories = () => {
  const [categories, setCategories] = useState();
  const [loading, setLoading] = useState(false);
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );

  const handleOpenCreateModal = () => setIsOpenCreateModal(true);
  const handleCloseCreateModal = () => setIsOpenCreateModal(false);

  const handleOpenEditModal = (category: any) => {
    setSelectedCategory(category);
    methods.reset({ name: category.name });
    setIsOpenEditModal(true);
  };
  const handleCloseEditModal = () => {
    setSelectedCategory(null);
    setIsOpenEditModal(false);
    methods.reset({ name: "" });
  };

  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
  });

  const onSubmitCreate: SubmitHandler<FormData> = async (data) => {
    const response = await createCategory(data);

    if (response && response.success) {
      toast.success("Category created successfully");
      handleCloseCreateModal();
      fetchCategoriesData();
    } else {
      throw new Error("Failed to create category");
    }
  };

  const onSubmitEdit: SubmitHandler<FormData> = async (data) => {
    try {
      if (!selectedCategory) {
        throw new Error("No category selected");
      }

      const response = await updateCategory(selectedCategory._id, data);
      if (response && response.success) {
        toast.success("Category updated successfully");
        handleCloseEditModal();
        fetchCategoriesData();
      } else {
        throw new Error("Failed to update category");
      }
    } catch (error) {
      toast.error("Error updating category");
    }
  };

  const submitDelete = async (category: ICategory) => {
    try {
      const response = await deleteCategory(category._id);
      if (response && response.success) {
        toast.success("Category deleted successfully");
        handleCloseEditModal();
        fetchCategoriesData();
      } else {
        throw new Error("Failed to delete category");
      }
    } catch (error) {
      toast.error("Error deleting category");
    }
  };

  const fetchCategoriesData = async () => {
    try {
      setLoading(true);
      const response = await getCategories();
      setCategories(response.data.treesCategory);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {
    fetchCategoriesData();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Action",
      key: "action",
      render: (category: any) => (
        <Space size="middle">
          <Button onClick={() => handleOpenEditModal(category)}>
            <SquarePen strokeWidth={0.75} />
            Edit
          </Button>
          <Button onClick={() => submitDelete(category)}>
            <Trash2 strokeWidth={0.75} /> Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <section className="relative">
      <div className="bg-white size-full shadow-box rounded-lg px-8 py-3">
        Categories
        <div className="flex justify-end mt-5 mb-3">
          <Button onClick={handleOpenCreateModal}>
            <BadgePlus strokeWidth={0.75} /> Add new category
          </Button>
        </div>
        <div>
          <Table loading={loading} dataSource={categories} columns={columns} />
        </div>
      </div>
      <Modal
        width={800}
        open={isOpenCreateModal}
        onCancel={handleCloseCreateModal}
        footer={[<></>]}
      >
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmitCreate)}
            className="form"
          >
            <h1 className="text-xl font-semibold mb-5">Add category</h1>
            <label>Name:</label>
            <Input name="name" />
            <div className="flex-center mt-5">
              <Button type="submit">Create</Button>
            </div>
          </form>
        </FormProvider>
      </Modal>
      <Modal
        width={800}
        open={isOpenEditModal}
        onCancel={handleCloseEditModal}
        footer={null}
      >
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmitEdit)} className="form">
            <h1 className="text-xl font-semibold mb-5">Edit category</h1>
            <label>Name:</label>
            <Input name="name" />
            <div className="flex-center mt-5">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </FormProvider>
      </Modal>
    </section>
  );
};

export default Categories;
