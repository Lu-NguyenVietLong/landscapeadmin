"use client";

// src/pages/BlogCategory.tsx
import React, { useEffect, useState } from "react";
import { Table, Image, Button, Space, message, Modal } from "antd";
import CreateCategoryModal from "./CreateCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import {
  deleteBlogCategory,
  getBlogCategories,
} from "@/packages/services/blogCategory";
import { IBlogCategory } from "@/packages/interfaces/blog.interface";

const BlogCategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<IBlogCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] =
    useState<IBlogCategory | null>(null);

  // Hàm fetch danh sách category
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getBlogCategories();
      if (res.success && res.categories) {
        const data = Array.isArray(res.categories)
          ? res.categories
          : [res.categories];
        setCategories(data);
      } else {
        message.error("Không lấy được dữ liệu danh mục!");
      }
    } catch (error) {
      console.error("Error fetching blog categories:", error);
      message.error("Có lỗi khi lấy danh mục!");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Xử lý xóa danh mục
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Xóa danh mục",
      content: "Bạn có chắc muốn xóa danh mục này không?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const res = await deleteBlogCategory(id);
          if (res.success) {
            message.success("Xóa danh mục thành công!");
            fetchCategories();
          } else {
            message.error(res.message || "Có lỗi khi xóa danh mục!");
          }
        } catch (error) {
          message.error("Có lỗi khi xóa danh mục!");
          console.error(error);
        }
      },
    });
  };

  // Định nghĩa các cột cho bảng
  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      width: 150,
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      width: 200,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: 250,
      render: (text: string) => text || "N/A",
    },
    {
      title: "Ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 100,
      render: (imageUrl: string) =>
        imageUrl ? <Image width={50} src={imageUrl} alt="Category" /> : "N/A",
    },
    {
      title: "Danh mục cha",
      dataIndex: "parentCategory",
      key: "parentCategory",
      width: 200,
      render: (parentCategory: any) =>
        parentCategory
          ? typeof parentCategory === "string"
            ? parentCategory
            : (parentCategory as IBlogCategory).name
          : "N/A",
    },
    {
      title: "Action",
      key: "action",
      width: 150,
      render: (_: any, record: IBlogCategory) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => {
              setSelectedCategory(record);
              setEditModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1>Danh sách Blog Category</h1>
      <Button
        type="primary"
        onClick={() => setCreateModalVisible(true)}
        style={{ marginBottom: 20 }}
      >
        Tạo Category
      </Button>
      <Table
        dataSource={categories}
        columns={columns}
        rowKey="_id"
        loading={loading}
        bordered
      />

      {/* Modal tạo mới danh mục */}
      <CreateCategoryModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSuccess={fetchCategories}
      />

      {/* Modal chỉnh sửa danh mục */}
      {selectedCategory && (
        <EditCategoryModal
          visible={editModalVisible}
          onClose={() => {
            setEditModalVisible(false);
            setSelectedCategory(null);
          }}
          onSuccess={fetchCategories}
          category={selectedCategory}
        />
      )}
    </div>
  );
};

export default BlogCategoryPage;
