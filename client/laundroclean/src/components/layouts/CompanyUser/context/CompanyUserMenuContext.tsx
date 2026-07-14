"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { MenuItem } from "src/components/ui/AppHeaderMenu/AppHeaderMenu";
import { CompanyUser } from "src/types/users/user";

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

  const setActiveMenu = useCallback((key: string,) => {
    try {
      localStorage.setItem("companyUserActiveMenu", key);
      if (user.uiRole === "STAFF") {
        window.history.replaceState(
          null,
          "",
          `/staff/dashboard#${key}`,
        )
      } else if (user.uiRole === "ADMIN") {
        window.history.replaceState(
          null,
          "",
          `/admin/dashboard#${key}`
        )
      }

    } catch {
      // ignore
    }
    
    setActiveMenuState(key);
  }, [user.uiRole]);


  useEffect(() => {
    try {
      const saved = localStorage.getItem("companyUserActiveMenu");
      if (saved) setActiveMenuState(saved);
      const syncMenuWithHash = () => {
        switch (window.location.hash) {
          case "#settings":
            setActiveMenu("settings");
            break;
        }
      };

      syncMenuWithHash();

      window.addEventListener("hashchange", syncMenuWithHash);
      return () => {
        window.removeEventListener("hashchange", syncMenuWithHash)
      }
    } catch {
      // ignore
    }
  }, [setActiveMenu]);

  return (
    <CompanyUserMenuContext.Provider value={{ user, activeMenu, setActiveMenu, menuItems, setMenuItems }}>
      {children}
    </CompanyUserMenuContext.Provider>
  );
};
