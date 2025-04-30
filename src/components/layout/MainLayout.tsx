
import React, { ReactNode } from "react";
import { SidebarProvider } from "./Sidebar/SidebarContext";
import { Toaster } from "sonner";
import { Sidebar } from "./Sidebar/Sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="container py-6 md:py-8 px-4 md:px-6">{children}</div>
        </main>
      </div>
      <Toaster position="top-right" richColors />
    </SidebarProvider>
  );
};

export default MainLayout;
