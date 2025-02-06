"use client";
// src/components/EditCategoryModal.tsx
import React from "react";
import { Modal, message } from "antd";
import BlogCategoryForm from "./BlogCategoryForm";
import { updateBlogCategory } from "@/packages/services/blog";

interface EditCategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category: IBlogCategory;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  visible,
  onClose,
  onSuccess,
  category,
}) => {
  const handleFinish = async (values: any) => {
    try {
      const res = await updateBlogCategory(category._id, {
        ...category,
        ...values,
      });
      if (res.success) {
        message.success("Cập nhật danh mục thành công!");
        onSuccess();
        onClose();
      } else {
        message.error(res.message || "Có lỗi khi cập nhật danh mục!");
      }
    } catch (error) {
      message.error("Có lỗi khi cập nhật danh mục!");
      console.error(error);
    }
  };

  return (
    <Modal
      title="Chỉnh sửa Blog Category"
      visible={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <BlogCategoryForm
        initialValues={category}
        onFinish={handleFinish}
        submitText="Cập nhật danh mục"
      />
    </Modal>
  );
};

export default EditCategoryModal;
