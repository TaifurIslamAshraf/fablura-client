import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ProtectedDashboard from "@/lib/ProtectedDashboard";
import { ReactNode } from "react";

const dashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="max-w-[1400px] mx-auto">
      <ProtectedDashboard>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <main>{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </ProtectedDashboard>
    </div>
  );
};

export default dashboardLayout;
