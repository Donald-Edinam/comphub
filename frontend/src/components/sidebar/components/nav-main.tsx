import { MoreHorizontal, type LucideIcon } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const { isMobile } = useSidebar()
  const location = useLocation()

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const isCurrentPage = location.pathname === item.url
          const hasSubItems = item.items && item.items.length > 0

          if (!hasSubItems) {
            // Single navigation item without dropdown
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isCurrentPage}>
                  <Link to={item.url} className="flex items-center gap-2">
                    {item.icon && <item.icon className="size-4" />}
                    {item.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }

          // Navigation item with dropdown
          return (
            <DropdownMenu key={item.title}>
              <SidebarMenuItem>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                    <div className="flex items-center gap-2">
                      {item.icon && <item.icon className="size-4" />}
                      {item.title}
                    </div>
                    <MoreHorizontal className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                  className="min-w-56 rounded-lg"
                >
                  {item.items?.map((subItem) => (
                    <DropdownMenuItem asChild key={subItem.title}>
                      <Link to={subItem.url}>{subItem.title}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </SidebarMenuItem>
            </DropdownMenu>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
