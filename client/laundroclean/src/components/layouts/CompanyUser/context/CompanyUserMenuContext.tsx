"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { MenuItem } from "src/components/ui/AppHeaderMenu/AppHeaderMenu";
import { CompanyUser } from "src/types/user";

interface MenuContextType {
  user: CompanyUser;
  activeMenu: string; // never null; defaults to last-clicked or 'overview'
  setActiveMenu: (key: string) => void;
  menuItems: MenuItem[];
  setMenuItems: (items: MenuItem[]) => void;
}

export const CompanyUserMenuContext =
  createContext<MenuContextType | undefined>(undefined);

export function useCompanyUserMenu() {
  const context = useContext(CompanyUserMenuContext);
  if (!context) {
    throw new Error("useCompanyUserMenu must be used within layout");
  }
  return context;
}

interface ProviderProps {
  user: CompanyUser;
  children: ReactNode;
  initialMenuItems?: MenuItem[];
}

export const CompanyUserMenuProvider = ({ children, initialMenuItems = [], user }: ProviderProps) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);

  const [activeMenu, setActiveMenuState] = useState<string>("overview");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("companyUserActiveMenu");
      if (saved) setActiveMenuState(saved);
    } catch {
      // ignore
    }
  }, []);

  const setActiveMenu = (key: string) => {
    try {
      localStorage.setItem("companyUserActiveMenu", key);
    } catch {
      // ignore
    }
    setActiveMenuState(key);
  };

  return (
    <CompanyUserMenuContext.Provider value={{ user, activeMenu, setActiveMenu, menuItems, setMenuItems }}>
      {children}
    </CompanyUserMenuContext.Provider>
  );
};
