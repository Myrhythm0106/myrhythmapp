
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SidebarProvider } from "@/components/layout/Sidebar/SidebarContext";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

const Dashboard = () => {
  return (
    <SidebarProvider>
      <MainLayout>
        <DashboardContent />
      </MainLayout>
    </SidebarProvider>
  );
};

export default Dashboard;
