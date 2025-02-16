"use client";
import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Switch,
  DatePicker,
  Select,
  InputNumber,
} from "antd";
import moment from "moment";
import BundledEditor from "@/components/primitive/BundledEditor";
import { IBlog, IBlogCategory } from "@/packages/interfaces/blog.interface";
import { removeBaseUrlImage } from "@/utils/helpers";

const { Option } = Select;

interface BlogFormProps {
  initialValues?: Partial<IBlog>;
  onFinish: (values: any) => void;
  loading?: boolean;
  submitText?: string;
  categories: IBlogCategory[] | undefined;
}

const BlogForm: React.FC<BlogFormProps> = ({
  initialValues,
  onFinish,
  loading = false,
  submitText = "Lưu",
  categories,
}) => {
  const [editorContent, setEditorContent] = useState<string>("");

  // Nếu có initialValues (trường hợp chỉnh sửa), set nội dung editor
  useEffect(() => {
    if (initialValues?.content) {
      setEditorContent(initialValues.content);
    }
  }, [initialValues]);

  console.log("initialValues");

  const handleFinish = (values: any) => {
    // Nếu có publicationDate (moment object), chuyển về Date
    if (values.featuredImage) {
      values.featuredImage = removeBaseUrlImage(values.featuredImage);
    }
    if (values.publicationDate) {
      values.publicationDate = values.publicationDate.toDate();
    }
    onFinish({ ...values, content: editorContent });
  };

  return (
    <Form
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{
        ...initialValues,
        categories: initialValues?.categories
          ? initialValues.categories.map((cat: any) =>
              typeof cat === "object" ? cat._id : cat
            )
          : undefined,
        publicationDate: initialValues?.publicationDate
          ? moment(initialValues.publicationDate)
          : undefined,
        published: initialValues?.published || false,
      }}
      preserve={false}
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: "Please enter the title!" }]}
      >
        <Input placeholder="Enter blog title" />
      </Form.Item>
      <Form.Item
        label="Excerpt"
        name="excerpt"
        rules={[{ required: true, message: "Please enter the excerpt!" }]}
      >
        <Input.TextArea rows={3} placeholder="Enter blog excerpt" />
      </Form.Item>
      <Form.Item label="Content" required>
        <BundledEditor
          value={editorContent}
          onEditorChange={(content: string) => setEditorContent(content)}
        />
      </Form.Item>
      <Form.Item label="Featured Image URL" name="featuredImage">
        <Input placeholder="Enter featured image URL (optional)" />
      </Form.Item>
      <Form.Item label="Categories" name="categories">
        {/* Ví dụ sử dụng Select mode multiple; bạn có thể thay thế bằng dữ liệu từ API */}
        <Select mode="multiple" placeholder="Select categories">
          {categories?.map((category) => (
            <Option key={category._id} value={category._id}>
              {category.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Tags (comma separated)" name="tags">
        <Input placeholder="Enter tags, e.g. react,javascript" />
      </Form.Item>
      <Form.Item label="Published" name="published" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item label="Publication Date" name="publicationDate">
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item label="Meta Title (SEO)" name={["seo", "metaTitle"]}>
        <Input placeholder="Enter meta title for SEO" />
      </Form.Item>
      <Form.Item
        label="Meta Description (SEO)"
        name={["seo", "metaDescription"]}
      >
        <Input.TextArea rows={2} placeholder="Enter meta description for SEO" />
      </Form.Item>
      <Form.Item
        label="Meta Keywords (SEO, comma separated)"
        name={["seo", "metaKeywords"]}
      >
        <Input placeholder="Enter meta keywords, e.g. blog,news" />
      </Form.Item>
      <Form.Item label="Views" name="views">
        <InputNumber
          min={0}
          style={{ width: "100%" }}
          placeholder="Enter view count"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {submitText}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BlogForm;
