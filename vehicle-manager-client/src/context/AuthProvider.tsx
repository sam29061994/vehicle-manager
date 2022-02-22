import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useMemo,
} from "react";
import useLocalStorage from "./useLocalStorage";

interface AuthContextInterface {
  user: string;
  setUser: Dispatch<SetStateAction<string>>;
}

type AuthProviderProps = {
  children?: React.ReactNode;
};

const initialContext: AuthContextInterface = {
  user: "",
  setUser: (): void => {
    throw new Error("setContext function must be overridden");
  },
};

export const AuthContext = createContext<AuthContextInterface>(initialContext);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useLocalStorage("user");
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
