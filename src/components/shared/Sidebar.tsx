import {
  Building2,
  FileText,
  CheckCircle,
  Package,
  User,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to?: string;
  isActive?: boolean;
  badge?: string;
  onClick?: () => void;
}

const SidebarItem = ({
  icon: Icon,
  label,
  to,
  isActive,
  badge,
  onClick,
}: SidebarItemProps) => {
  const content = (
    <div
      className={cn(
        "flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group",
        isActive
          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
      )}
    >
      <div className="flex items-center space-x-3">
        <Icon
          className={cn(
            "h-5 w-5 transition-all duration-200",
            isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700",
          )}
        />
        <span className="font-medium">{label}</span>
      </div>
      {badge && (
        <span
          className={cn(
            "px-2 py-1 text-xs rounded-full font-semibold",
            isActive
              ? "bg-white/20 text-white"
              : "bg-indigo-100 text-indigo-600",
          )}
        >
          {badge}
        </span>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block">
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className="w-full">
      {content}
    </button>
  );
};

interface SidebarProps {
  className?: string;
  currentPage?: string;
}

const Sidebar = ({ className, currentPage }: SidebarProps) => {
  const location = useLocation();

  const isActivePath = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }
    return location.pathname === path;
  };

  const mainNavItems = [
    {
      icon: Building2,
      label: "Dashboard",
      to: "/dashboard",
      isActive: isActivePath("/dashboard"),
    },
    {
      icon: FileText,
      label: "Purchase Requests",
      to: "/purchase-requests",
      isActive: isActivePath("/purchase-requests"),
      badge: "12",
    },
    {
      icon: CheckCircle,
      label: "Approve Requests",
      to: "/approve-requests",
      isActive: isActivePath("/approve-requests"),
      badge: "5",
    },
    {
      icon: Package,
      label: "Purchase Orders",
      to: "/purchase-orders",
      isActive: isActivePath("/purchase-orders"),
    },
  ];

  const secondaryNavItems = [
    {
      icon: User,
      label: "User Profile",
      to: "/profile",
      isActive: isActivePath("/profile"),
    },
    {
      icon: Settings,
      label: "Settings",
      onClick: () => alert("Settings coming soon!"),
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      onClick: () => alert("Help center coming soon!"),
    },
  ];

  return (
    <aside
      className={cn(
        "w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col",
        className,
      )}
    >
      {/* Main Navigation */}
      <div className="flex-1 px-4 py-6">
        <div className="space-y-1">
          {mainNavItems.map((item, index) => (
            <SidebarItem key={index} {...item} />
          ))}
        </div>

        <Separator className="my-6" />

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Quick Actions
          </h3>
          <Link to="/submit-request">
            <Button className="w-full justify-start bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg">
              <FileText className="h-4 w-4 mr-2" />
              Submit Request
            </Button>
          </Link>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-200 p-4">
        <div className="space-y-1">
          {secondaryNavItems.map((item, index) => (
            <SidebarItem key={index} {...item} />
          ))}
          <SidebarItem
            icon={LogOut}
            label="Sign Out"
            onClick={() => {
              if (confirm("Are you sure you want to sign out?")) {
                window.location.href = "/login";
              }
            }}
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
