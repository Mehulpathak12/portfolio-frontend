"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface UserInfo {
  id: string;
  username: string;
  name: string;
  email?: string;
  role: string;
}

interface AdminContextType {
  isAdmin: boolean;
  adminUser: UserInfo | null;
  portfolio: any;
  loading: boolean;
  authChecking: boolean;
  loginModalOpen: boolean;
  setLoginModalOpen: (open: boolean) => void;
  activeEditModal: string | null;
  activeEditItem: any | null;
  openEditModal: (modalType: string, itemData?: any) => void;
  closeEditModal: () => void;
  login: (credentials: { username?: string; email?: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshPortfolio: () => Promise<void>;
  handleLogoClick: () => void;
  getAuthHeaders: () => Record<string, string>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState<UserInfo | null>(null);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [activeEditModal, setActiveEditModal] = useState<string | null>(null);
  const [activeEditItem, setActiveEditItem] = useState<any | null>(null);
  const [clickCount, setClickCount] = useState(0);

  const getAuthHeaders = useCallback(() => {
    const headers: Record<string, string> = {};
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("admin_token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return headers;
  }, []);

  const fetchPortfolio = useCallback(async () => {
    try {
      const res = await fetch("/api/portfolio");
      if (res.ok) {
        const data = await res.json();
        setPortfolio(data);
      }
    } catch (err) {
      console.error("Failed to load portfolio:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const checkAuth = useCallback(async () => {
    setAuthChecking(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch("/api/admin/me", { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setIsAdmin(true);
          setAdminUser(data.user);
          if (token && typeof document !== "undefined") {
            document.cookie = `admin_token=${token}; path=/; max-age=604800; SameSite=Lax`;
          }
        } else {
          setIsAdmin(false);
          setAdminUser(null);
        }
      } else {
        setIsAdmin(false);
        setAdminUser(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem("admin_token");
          document.cookie = "admin_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
      }
    } catch {
      setIsAdmin(false);
      setAdminUser(null);
    } finally {
      setAuthChecking(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolio();
    checkAuth();

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const secret = params.get("secret") || params.get("key");
      if (secret === "edit" || secret === "admin" || secret === "mehul2026") {
        setLoginModalOpen(true);
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.shiftKey && (e.key === "E" || e.key === "e")) {
          e.preventDefault();
          setLoginModalOpen((prev) => !prev);
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [fetchPortfolio, checkAuth]);

  const handleLogoClick = () => {
    setClickCount((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        setLoginModalOpen(true);
        return 0;
      }
      setTimeout(() => setClickCount(0), 1000);
      return next;
    });
  };

  const login = async (credentials: { username?: string; email?: string; password: string }) => {
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAdmin(true);
        setAdminUser(data.user);
        if (typeof window !== "undefined" && data.token) {
          localStorage.setItem("admin_token", data.token);
          document.cookie = `admin_token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
        }
        setLoginModalOpen(false);
        await fetchPortfolio();
        return { success: true };
      } else {
        return { success: false, error: data.detail || data.error || "Authentication failed" };
      }
    } catch (err: any) {
      return { success: false, error: err.message || "Network error" };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        headers: getAuthHeaders(),
      });
    } catch {
      // ignore
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("admin_token");
        document.cookie = "admin_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
      setIsAdmin(false);
      setAdminUser(null);
    }
  };

  const openEditModal = (modalType: string, itemData: any = null) => {
    setActiveEditModal(modalType);
    setActiveEditItem(itemData);
  };

  const closeEditModal = () => {
    setActiveEditModal(null);
    setActiveEditItem(null);
  };

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        adminUser,
        portfolio,
        loading,
        authChecking,
        loginModalOpen,
        setLoginModalOpen,
        activeEditModal,
        activeEditItem,
        openEditModal,
        closeEditModal,
        login,
        logout,
        refreshPortfolio: fetchPortfolio,
        handleLogoClick,
        getAuthHeaders,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
