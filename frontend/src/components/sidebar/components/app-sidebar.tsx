import * as React from "react"
import { Package, Home, Plus, BarChart3, Settings, User } from "lucide-react"
import { useAuth } from "../../../context/AuthContext"
import { NavMain } from "../components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "../components/ui/sidebar"

// Component tracker navigation data
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Components",
      url: "#",
      icon: Package,
      items: [
        {
          title: "All Components",
          url: "/dashboard/components",
        },
        {
          title: "Add Component",
          url: "/dashboard/components/add",
        },
        {
          title: "Low Stock",
          url: "/dashboard/components/low-stock",
        },
      ],
    },
    {
      title: "Reports",
      url: "#",
      icon: BarChart3,
      items: [
        {
          title: "Inventory Report",
          url: "/dashboard/reports/inventory",
        },
        {
          title: "Stock Movement",
          url: "/dashboard/reports/movement",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
      items: [
        {
          title: "Profile",
          url: "/dashboard/settings/profile",
        },
        {
          title: "Preferences",
          url: "/dashboard/settings/preferences",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, logout } = useAuth();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Package className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Component Tracker</span>
                  <span className="text-xs">Repair Shop Inventory</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <User className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5 leading-none flex-1">
              <span className="font-medium text-sm">{user?.email}</span>
              <span className="text-xs text-muted-foreground">Shop Owner</span>
            </div>
            <button
              onClick={logout}
              className="text-xs text-red-600 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
