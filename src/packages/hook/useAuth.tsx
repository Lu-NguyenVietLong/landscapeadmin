"use client";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { IUser } from "../interfaces/user";
import { loginApi } from "@/packages/services/auth";

interface AuthContextType {
  user?: any;
  error?: any;
  login: (email: string, password: string) => void;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser>();
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  // useEffect(() => {
  //   if (error) setError(undefined);
  // }, [location.pathname, error]);
  // const memoedValue = useMemo(
  //   () => ({
  //     auth,
  //     setAuth,
  //   }),
  //   [auth, setAuth]
  // );

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log(email, password);
      const data = await loginApi({ email, password });
      console.log(data);
      setUser(data.user);
      console.log("user", user);
      console.log("data", data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const memoedValue = useMemo(
    () => ({
      user,
      login,
      error,
    }),
    [user, error]
  );
  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}

export { AuthProvider };
