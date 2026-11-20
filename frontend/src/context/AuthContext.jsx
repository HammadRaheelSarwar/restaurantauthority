import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

// Pre-defined seed profiles for instant role switching & preview
export const PREVIEW_ACCOUNTS = {
  super_admin: {
    id: 'a0000000-0000-0000-0000-000000000001',
    full_name: 'Sarah Jenkins',
    email: 'superadmin@rea-compliance.com',
    role: 'super_admin',
    roleTitle: 'Super Admin (Global Authority)'
  },
  admin: {
    id: 'a0000000-0000-0000-0000-000000000002',
    organization_id: '11111111-1111-1111-1111-111111111111',
    full_name: 'Michael Chang',
    email: 'admin@apexhospitality.com',
    role: 'admin',
    roleTitle: 'Organization Admin (Apex Group)'
  },
  restaurant_operator: {
    id: 'a0000000-0000-0000-0000-000000000003',
    organization_id: '11111111-1111-1111-1111-111111111111',
    full_name: 'Robert Vance',
    email: 'operator@apexhospitality.com',
    role: 'restaurant_operator',
    roleTitle: 'Restaurant Operator (Multi-Unit)'
  },
  restaurant_manager: {
    id: 'a0000000-0000-0000-0000-000000000004',
    organization_id: '11111111-1111-1111-1111-111111111111',
    full_name: 'Elena Rostova',
    email: 'manager@apex-downtown.com',
    role: 'restaurant_manager',
    roleTitle: 'Restaurant Manager (Flagship Location)'
  },
  electrical_assessor: {
    id: 'a0000000-0000-0000-0000-000000000005',
    full_name: 'David Martinez, PE',
    email: 'assessor@rea-compliance.com',
    role: 'electrical_assessor',
    roleTitle: 'Electrical Assessor (Licensed Inspector)'
  },
  certification_manager: {
    id: 'a0000000-0000-0000-0000-000000000006',
    full_name: 'Rachel Green',
    email: 'certification@rea-compliance.com',
    role: 'certification_manager',
    roleTitle: 'Certification Manager (Credentialing Lead)'
  },
  viewer: {
    id: 'a0000000-0000-0000-0000-000000000007',
    organization_id: '11111111-1111-1111-1111-111111111111',
    full_name: 'Thomas Hall',
    email: 'viewer@apexhospitality.com',
    role: 'viewer',
    roleTitle: 'Compliance Auditor (Viewer)'
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('rea_user');
    const savedToken = localStorage.getItem('rea_token');

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('rea_user');
      }
    } else {
      // Default initial role for ease of exploration: Super Admin
      switchRole('super_admin');
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.login({ email, password });
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem('rea_user', JSON.stringify(res.data.user));
        localStorage.setItem('rea_token', res.data.token || res.data.user.id);
        return { success: true };
      }
      return { success: false, message: res.error?.message || 'Login failed' };
    } catch (err) {
      // Check if matches preview account
      const preview = Object.values(PREVIEW_ACCOUNTS).find(p => p.email.toLowerCase() === email.toLowerCase());
      if (preview) {
        switchRole(preview.role);
        return { success: true };
      }
      return { success: false, message: err.message };
    }
  };

  const switchRole = (roleKey) => {
    const target = PREVIEW_ACCOUNTS[roleKey] || PREVIEW_ACCOUNTS.super_admin;
    setUser(target);
    localStorage.setItem('rea_user', JSON.stringify(target));
    localStorage.setItem('rea_token', target.id);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('rea_user');
    localStorage.removeItem('rea_token');
  };

  const hasRole = (allowedRoles = []) => {
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, switchRole, logout, hasRole, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
