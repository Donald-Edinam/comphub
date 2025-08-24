import { Outlet } from "react-router-dom";
import { AppSidebar } from "../components/sidebar/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/sidebar/components/ui/breadcrumb";
import { Separator } from "../components/sidebar/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../components/sidebar/components/ui/sidebar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "../components/ThemeToggle";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">
                  Component Tracker
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, {user?.email}</span>
            <ThemeToggle />
            <button 
              onClick={handleLogout}
              className="px-3 py-1 text-sm bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-colors"
            >
              Logout
            </button>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}