"use client";
// src/components/BlogCategoryForm.tsx
import React from "react";
import { Form, Input, Button } from "antd";
import { IBlogCategory } from "@/packages/interfaces/blog.interface";

interface CategoryFormProps {
  initialValues?: Partial<IBlogCategory>;
  onFinish: (values: any) => void;
  loading?: boolean;
  submitText?: string;
}

const BlogCategoryForm: React.FC<CategoryFormProps> = ({
  initialValues,
  onFinish,
  loading = false,
  submitText = "Lưu",
}) => {
  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      initialValues={initialValues}
      preserve={false} // Đảm bảo mỗi lần mở form là instance mới
    >
      <Form.Item
        label="Tên danh mục"
        name="name"
        rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
      >
        <Input placeholder="Nhập tên danh mục" />
      </Form.Item>

      <Form.Item label="Mô tả" name="description">
        <Input.TextArea rows={3} placeholder="Nhập mô tả danh mục (tùy chọn)" />
      </Form.Item>

      <Form.Item label="URL ảnh" name="imageUrl">
        <Input placeholder="Nhập URL ảnh đại diện (tùy chọn)" />
      </Form.Item>

      <Form.Item label="Danh mục cha" name="parentCategory">
        <Input placeholder="Nhập ID danh mục cha (tùy chọn)" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {submitText}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BlogCategoryForm;
