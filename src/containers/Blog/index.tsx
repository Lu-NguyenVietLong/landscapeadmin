"use client";
// src/pages/BlogList.tsx
import React, { useEffect, useState } from "react";
import { Table, Button, Space, message, Modal } from "antd";
import { deleteBlog, getBlogs } from "@/packages/services/blogApi";
import { getBlogCategories } from "@/packages/services/blogCategory";
import { IBlog, IBlogCategory } from "@/packages/interfaces/blog.interface";
import EditBlogModal from "./EditBlogModal";
import CreateBlogModal from "./CreateBlogModal";

const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [selectedBlog, setSelectedBlog] = useState<IBlog | null>(null);
  const [category, seCategory] = useState<IBlogCategory[] | undefined>([]);

  // Lấy danh sách blog từ API
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      // const res = await getBlogs();
      const [blogResponse, categoryResponse] = await Promise.all([
        getBlogs(),
        getBlogCategories(),
      ]);
      if (blogResponse && blogResponse.success && blogResponse.blogs) {
        const data = Array.isArray(blogResponse.blogs)
          ? blogResponse.blogs
          : [blogResponse.blogs];
        setBlogs(data);
        console.log("category", category);
      } else {
        message.error("Không lấy được dữ liệu blog!");
      }

      if (
        categoryResponse &&
        categoryResponse.success &&
        categoryResponse.categories
      ) {
        seCategory(categoryResponse.categories);
      } else {
        message.error("Không lấy được dữ liệu category!");
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      message.error("Có lỗi khi lấy danh sách blog!");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Xử lý xóa blog
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Xóa Blog",
      content: "Bạn có chắc muốn xóa blog này không?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const res = await deleteBlog(id);
          if (res.success) {
            message.success("Xóa blog thành công!");
            fetchBlogs();
          } else {
            message.error(res.message || "Có lỗi khi xóa blog!");
          }
        } catch (error) {
          message.error("Có lỗi khi xóa blog!");
          console.error(error);
        }
      },
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      width: 150,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: 250,
    },
    {
      title: "Tóm tắt",
      dataIndex: "excerpt",
      key: "excerpt",
      width: 300,
      render: (text: string) => text || "N/A",
    },
    {
      title: "Hành động",
      key: "action",
      width: 200,
      render: (_: any, record: IBlog) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => {
              setSelectedBlog(record);
              setEditModalVisible(true);
            }}
          >
            Sửa
          </Button>
          <Button
            type="link"
            danger
            onClick={() => record._id && handleDelete(record._id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1>Danh sách Blog</h1>
      <Button
        type="primary"
        onClick={() => setCreateModalVisible(true)}
        style={{ marginBottom: 20 }}
      >
        Thêm Blog
      </Button>
      <Table
        dataSource={blogs}
        columns={columns}
        rowKey="_id"
        loading={loading}
        bordered
      />

      {/* Modal tạo blog */}
      <CreateBlogModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSuccess={fetchBlogs}
        categories={category}
      />

      {/* Modal chỉnh sửa blog */}
      {selectedBlog && (
        <EditBlogModal
          visible={editModalVisible}
          onClose={() => {
            setEditModalVisible(false);
            setSelectedBlog(null);
          }}
          onSuccess={fetchBlogs}
          blog={selectedBlog}
          categories={category}
        />
      )}
    </div>
  );
};

export default BlogList;
