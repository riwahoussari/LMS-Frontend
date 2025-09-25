import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api } from "../services/api";
import { auth, type Tokens } from "../services/auth";
import { jwtDecode } from "jwt-decode";
import { ROLES, type RegisterDto, type Role } from "@/lib/constants";
import { toast } from "sonner";

export interface JwtPayload {
  sub: string;
  role: Role;
  exp: number;
  [key: string]: any;
}

interface AuthContextType {
  isAuth: boolean;
  user: JwtPayload | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuth, setIsAuth] = useState<boolean>(!!auth.getAccessToken());
  const [user, setUser] = useState<JwtPayload | null>(
    getUserFromToken(auth.getAccessToken())
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    auth.loadFromStorage(); // load tokens from localStorage
    const token = auth.getAccessToken();
    if (token) {
      setIsAuth(true);
      setUser(getUserFromToken(token));
    }
    setIsLoading(false);
  }, []);

  async function login(email: string, password: string) {
    const res = await api.post<Tokens>("/auth/login", { email, password });
    const { accessToken, refreshToken } = res.data;
    auth.saveTokens({ accessToken, refreshToken });
    const decoded = getUserFromToken(accessToken);
    setUser(decoded);
    setIsAuth(true);
  }

  async function register(data: RegisterDto) {
    const res = await api.post<Tokens>(`/auth/register-${data.role}`, data);
    if (data.role != ROLES.ADMIN) {
      const { accessToken, refreshToken } = res.data;
      auth.saveTokens({ accessToken, refreshToken });
      const decoded = getUserFromToken(accessToken);
      setUser(decoded);
      setIsAuth(true);
    }
  }

  async function logout() {
    try {
      await api.post("/auth/revoke", { refreshToken: auth.getRefreshToken() });
    } catch (err) {
      console.warn("Revoke failed:", err);
    } finally {
      auth.clear();
      setUser(null);
      setIsAuth(false);
      toast.success("Logged out successfully.")
    }
  }

  return (
    <AuthContext.Provider
      value={{ isAuth, isLoading, user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

// helper function
function getUserFromToken(token: string | null): JwtPayload | null {
  if (!token) return null;
  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
}
