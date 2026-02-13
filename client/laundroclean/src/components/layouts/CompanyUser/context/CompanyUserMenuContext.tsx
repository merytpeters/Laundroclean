"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { MenuItem } from "src/components/ui/AppHeaderMenu/AppHeaderMenu";

interface MenuContextType {
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
  children: ReactNode;
  initialMenuItems?: MenuItem[];
}

export const CompanyUserMenuProvider = ({ children, initialMenuItems = [] }: ProviderProps) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);

  return (
    <CompanyUserMenuContext.Provider value={{ activeMenu, setActiveMenu, menuItems, setMenuItems }}>
      {children}
    </CompanyUserMenuContext.Provider>
  );
};
