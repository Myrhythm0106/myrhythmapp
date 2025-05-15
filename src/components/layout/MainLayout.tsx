
import React, { ReactNode } from "react";
import { SidebarProvider } from "./Sidebar/SidebarContext";
import { Toaster } from "sonner";
import { Sidebar } from "./Sidebar/Sidebar";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { PomodoroProvider } from "@/components/pomodoro/PomodoroContext";
import { PomodoroButton } from "@/components/pomodoro/PomodoroButton";
import { GratitudeProvider } from "@/hooks/use-gratitude";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileMenu } from "@/components/mobile/MobileMenu";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const isMobile = useIsMobile();
  
  return (
    <GratitudeProvider>
      <PomodoroProvider>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            {!isMobile && <Sidebar />}
            <main className="flex-1 overflow-auto">
              <div className="flex justify-end items-center px-4 py-2 border-b">
                <div className="flex items-center gap-2">
                  <PomodoroButton variant="outline" size="sm" />
                  <GlobalSearch />
                </div>
              </div>
              <div className="container py-6 md:py-8 px-4 md:px-6">
                {isMobile && <MobileMenu />}
                {children}
              </div>
            </main>
          </div>
          <Toaster position="top-right" richColors />
        </SidebarProvider>
      </PomodoroProvider>
    </GratitudeProvider>
  );
};

export default MainLayout;
