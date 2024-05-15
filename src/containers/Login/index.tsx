"use client";
import useAuth from "@/packages/context/useAuth";
import { login } from "@/packages/services/auth";
import React, { useEffect, useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const HandleLogin = async () => {
    await login(email, password);
    console.log("dagoi");
  };

  return (
    <>
      <h1 className="text-center mt-10 font-semibold text-4xl">Login</h1>
      <form onSubmit={HandleLogin} className="max-w-[60%] mx-auto">
        <p className="text-gray-500 w-full">Email:</p>
        <input
          type="email"
          placeholder="Email@gmail.com"
          onChange={(e) => setEmail(e.target.value)}
          className="bg-slate-200 border-none outline-none py-3 w-full px-4 mt-2"
        />
        <p className="text-gray-500 w-full mt-3">Password:</p>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className="bg-slate-200 border-none outline-none py-3 w-full px-4 mt-2"
        />
        <div
          onClick={HandleLogin}
          className="bg-primary cursor-pointer text-center mt-6 text-white font-semibold py-3 w-full px-4 mt-2"
        >
          Login
        </div>
      </form>
    </>
  );
};

export default Login;
