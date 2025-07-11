import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import * as authApi from '../api/auth';
import { User, AuthContextType } from '../types';

interface DecodedToken {
  sub: string;
  authorities: string[];
  iat: number;
  exp: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// ✅ Función para determinar el rol más alto
const getHighestRole = (authorities: string[]): string => {
  // Orden de prioridad: ADMIN > EMPLOYEE
  if (authorities.includes('ADMIN') || authorities.includes('ROLE_ADMIN')) {
    return 'ADMIN';
  }
  if (authorities.includes('EMPLOYEE') || authorities.includes('ROLE_EMPLOYEE')) {
    return 'EMPLOYEE';
  }
  // Si no encuentra ninguno conocido, devolver el primero
  return authorities[0] || 'EMPLOYEE';
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Revisar si hay token guardado
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        
        // ✅ Obtener el rol más alto de las autoridades
        const highestRole = getHighestRole(decoded.authorities);
        
        const newUser: User = {
          id: '', // si tu backend no lo manda
          email: decoded.sub,
          name: '', // tu backend no lo manda
          role: highestRole, // ✅ Usar el rol más alto
          phone: '',
          createdAt: new Date(decoded.iat * 1000),
        };
        setUser(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
      } catch (error) {
        console.error('Token inválido:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const success = await authApi.login(email, password);
      if (success) {
        const token = localStorage.getItem('authToken');
        if (token) {
          const decoded = jwtDecode<DecodedToken>(token);
          
          // ✅ Obtener el rol más alto de las autoridades
          const highestRole = getHighestRole(decoded.authorities);
          
          const newUser: User = {
            id: '',
            email: decoded.sub,
            name: '',
            role: highestRole, // ✅ Usar el rol más alto
            phone: '',
            createdAt: new Date(decoded.iat * 1000),
          };
          setUser(newUser);
          localStorage.setItem('currentUser', JSON.stringify(newUser));
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt'> & { password: string }): Promise<boolean> => {
    setLoading(true);
    try {
      const success = await authApi.register({
        name: userData.name,
        email: userData.email,
        password: userData.password
      });
      return success;
    } catch (error) {
      console.error('Error en register:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
