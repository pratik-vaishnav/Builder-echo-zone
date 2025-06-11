import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, Search, Menu, Workflow } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import Logo from "./Logo";

interface HeaderProps {
  showSearch?: boolean;
  className?: string;
}

const navigationItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Purchase Requests", path: "/purchase-requests" },
  { label: "Approve Requests", path: "/approve-requests" },
  { label: "Purchase Orders", path: "/purchase-orders" },
];

const Header = ({ showSearch = true, className }: HeaderProps) => {
  const location = useLocation();

  const isActivePath = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }
    return location.pathname === path;
  };

  return (
    <header
      className={cn(
        "bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50",
        className,
      )}
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Logo & Navigation */}
          <div className="flex items-center space-x-8">
            <Logo />

            {/* Main Navigation */}
            <nav className="hidden lg:flex space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "relative px-1 py-2 text-sm font-medium transition-colors duration-200",
                    isActivePath(item.path)
                      ? "text-indigo-600"
                      : "text-gray-600 hover:text-gray-900",
                  )}
                >
                  {item.label}
                  {isActivePath(item.path) && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full" />
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Section - Search, Notifications, Profile */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            {showSearch && (
              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  className="pl-10 w-64 h-9 bg-gray-50 border-gray-200 focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 transition-all"
                />
              </div>
            )}

            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="relative p-2 hover:bg-gray-100"
            >
              <Bell className="h-5 w-5 text-gray-600" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white" />
            </Button>

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2 hover:bg-gray-100"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </Button>

            {/* User Profile */}
            <Link to="/profile" className="group">
              <div className="flex items-center space-x-3 p-1 rounded-lg hover:bg-gray-50 transition-colors">
                <Avatar className="h-8 w-8 ring-2 ring-transparent group-hover:ring-indigo-200 transition-all">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-semibold">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-500">Manager</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
