"use client";
import React, { useState } from "react";
import { Modal, message } from "antd";
import BlogForm from "./blogForm";
import { updateBlog } from "@/packages/services/blogApi";
import { IBlog, IBlogCategory } from "@/packages/interfaces/blog.interface";

interface EditBlogModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  blog: IBlog;
  categories: IBlogCategory[] | undefined;
}

const EditBlogModal: React.FC<EditBlogModalProps> = ({
  visible,
  onClose,
  onSuccess,
  blog,
  categories,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await updateBlog(blog._id as string, values);
      if (res.success) {
        message.success("Blog updated successfully!");
        onSuccess();
        onClose();
      } else {
        message.error(res.message || "Error updating blog!");
      }
    } catch (error) {
      message.error("Error updating blog!");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <Modal
      title="Edit Blog"
      visible={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <BlogForm
        initialValues={blog}
        onFinish={handleFinish}
        loading={loading}
        submitText="Update Blog"
        categories={categories}
      />
    </Modal>
  );
};

export default EditBlogModal;
