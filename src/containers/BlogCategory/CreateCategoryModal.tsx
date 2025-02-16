"use client";
// src/components/CreateCategoryModal.tsx
import React from "react";
import { Modal, message } from "antd";
import BlogCategoryForm from "./BlogCategoryForm";
import { createBlogCategory } from "@/packages/services/blogCategory";

interface CreateCategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const handleFinish = async (values: any) => {
    try {
      const res = await createBlogCategory(values);
      if (res.success) {
        message.success("Tạo danh mục thành công!");
        onSuccess();
        onClose();
      } else {
        message.error(res.message || "Có lỗi khi tạo danh mục!");
      }
    } catch (error) {
      message.error("Có lỗi khi tạo danh mục!");
      console.error(error);
    }
  };

  return (
    <Modal
      title="Tạo mới Blog Category"
      visible={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      maskClosable={false}
      width="100%"
    >
      <BlogCategoryForm onFinish={handleFinish} submitText="Tạo danh mục" />
    </Modal>
  );
};

export default CreateCategoryModal;
