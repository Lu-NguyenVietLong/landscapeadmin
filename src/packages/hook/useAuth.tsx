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
import Cookies from "js-cookie";

interface AuthContextType {
  user?: any;
  error?: any;
  login: (email: string, password: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser>();
  const [token, setToken] = useState("");
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  const storeData = Cookies.get("Info");

  useEffect(() => {
    if (storeData) {
      const { token, user } = JSON.parse(storeData);
      setToken(token);
      setUser(user);
    }
  }, []);
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
      const data = await loginApi({ email, password });
      setUser(data.user);
      if (data && data.token) {
        Cookies.set(
          "Info",
          JSON.stringify({ token: data.token, user: data.user })
        );
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove("Info");
    setUser(undefined);
  };

  const memoedValue = useMemo(
    () => ({
      user,
      login,
      logout,
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
