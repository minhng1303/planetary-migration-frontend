import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin } from '../api/auth';
import { decodeToken } from '../utils/auth';

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
  hasAccessToPlanet: (planetId: number) => boolean;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = decodeToken(token);
        setUser(decoded);
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    const { token } = await apiLogin(username, password);
    localStorage.setItem('token', token);
    const decoded = decodeToken(token);
    setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const isAuthenticated = !!user;

  const hasRole = (role: string) => {
    return user?.role === role;
  };

  const hasAccessToPlanet = (planetId: number) => {
    if (!user) return false;
    if (user.role === 'SuperAdmin') return true;
    if (user.role === 'PlanetAdmin') return planetId === user.assignedPlanetId;
    if (user.role === 'ViewerType1') return planetId === 1;
    if (user.role === 'ViewerType2') return planetId === 1 || planetId === 3;
    return false;
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    hasRole,
    hasAccessToPlanet
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}