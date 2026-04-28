"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { MenuItem } from "src/components/ui/AppHeaderMenu/AppHeaderMenu";
import { CompanyUser } from "src/types/user";

interface MenuContextType {
  user: CompanyUser;
  activeMenu: string | null;
  setActiveMenu: (key: string | null) => void;
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
  const [activeMenu, setActiveMenu] = useState<string | null>("overview");
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);

  return (
    <CompanyUserMenuContext.Provider value={{ user, activeMenu, setActiveMenu, menuItems, setMenuItems }}>
      {children}
    </CompanyUserMenuContext.Provider>
  );
};
