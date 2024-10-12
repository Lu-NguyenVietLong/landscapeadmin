"use client";
import useAuth from "@/packages/hook/useAuth";
import { Button, Form, Input } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const HandleLogin = async (values: any) => {
    try {
      setLoading(true);
      const { email, password } = values;
      const response = await login(email, password);

      if (!response.success) {
        toast.error(response.message);
      } else {
        toast.success("Login successful!");
      }

      setLoading(false);
    } catch (error) {
      toast.error("An error occurred while logging in.");
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-center mt-10 font-semibold text-4xl">Login</h1>
      <Form
        onFinish={HandleLogin} // Ant Design handles the form submission
        className="lg:max-w-[60%] max-w-[80%] mx-auto"
      >
        <p className="text-gray-500 w-full">Email:</p>
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input
            type="email"
            placeholder="Email@gmail.com"
            className="bg-slate-200 border-none outline-none py-3 w-full px-4 mt-2"
          />
        </Form.Item>

        <p className="text-gray-500 w-full mt-3">Password:</p>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password
            placeholder="Password"
            className="bg-slate-200 border-none outline-none py-3 w-full px-4 mt-2"
          />
        </Form.Item>

        <Button
          loading={loading}
          htmlType="submit"
          className="bg-primary mt-6 font-semibold w-full h-12"
        >
          Login
        </Button>
      </Form>
    </>
  );
};

export default Login;
