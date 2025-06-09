import { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin } from "../api/auth";
import { decodeToken } from "../utils/auth";
import { PlanetType } from "../types/planetType";

interface User {
  username: string;
  role: string;
  assignedPlanetId: number;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
  hasAccessToPlanet: (planetId: number, planetType: string) => boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // 👈 Add this

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = decodeToken(token);
        setUser(decoded);
      } catch (error) {
        localStorage.removeItem("token");
      }
    }
    setLoading(false); // 👈 Done checking
  }, []);

  const login = async (username: string, password: string) => {
    const { token } = await apiLogin(username, password);
    localStorage.setItem("token", token);
    const decoded = decodeToken(token);
    setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const isAuthenticated = !!user;

  const hasRole = (role: string) => user?.role === role;

  const hasAccessToPlanet = (planetId: number, planetType: string) => {
    if (!user) return false;
    if (user.role === "SuperAdmin") return true;
    if (user.role === "PlanetAdmin") return planetId === user.assignedPlanetId;
    if (user.role === "ViewerType1") return planetType === PlanetType.TYPE_1;
    if (user.role === "ViewerType2") return planetType === PlanetType.TYPE_2;
    return false;
  };

  const value: AuthContextType & { loading: boolean } = {
    user,
    login,
    logout,
    isAuthenticated,
    hasRole,
    hasAccessToPlanet,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
