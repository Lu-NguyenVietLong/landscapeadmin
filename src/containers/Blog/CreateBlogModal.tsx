"use client";
import React, { useState } from "react";
import { Modal, message } from "antd";
import { createBlog } from "@/packages/services/blogApi";
import BlogForm from "./blogForm";
import { IBlogCategory } from "@/packages/interfaces/blog.interface";

interface CreateBlogModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categories: IBlogCategory[] | undefined;
}

const CreateBlogModal: React.FC<CreateBlogModalProps> = ({
  visible,
  onClose,
  onSuccess,
  categories,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await createBlog(values);
      if (res.success) {
        message.success("Blog created successfully!");
        onSuccess();
        onClose();
      } else {
        message.error(res.message || "Error creating blog!");
      }
    } catch (error) {
      message.error("Error creating blog!");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <Modal
      title="Create New Blog"
      visible={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <BlogForm
        onFinish={handleFinish}
        loading={loading}
        submitText="Create Blog"
        categories={categories}
      />
    </Modal>
  );
};

export default CreateBlogModal;
