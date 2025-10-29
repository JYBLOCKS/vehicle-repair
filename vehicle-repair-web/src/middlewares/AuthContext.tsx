import { createContext, useContext, useState } from "react";
import { login } from "../api/user.api";
import type { User } from "../models/User";

const AuthContext = createContext<{
  user: Omit<User, "name"> | null;
  Login: (email: string, password: string) => Promise<void>;
  Logout: () => void;
} | null>(null);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<Omit<User, "name"> | null>(null);

  const Login = async (email: string, password: string) => {
    const token = await login(email, password);
    localStorage.setItem("auth", JSON.stringify({ ...token }));
    console.log(token);
    setUser({ email, ...token });
  };

  const Logout = () => {
    setUser(null);
    return localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, Login, Logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};
