import { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
  showSearch?: boolean;
  className?: string;
  currentPage?: string;
}

const Layout = ({
  children,
  showSidebar = true,
  showSearch = true,
  className,
  currentPage,
}: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <Header showSearch={showSearch} />
      <div className="flex">
        {showSidebar && (
          <Sidebar
            className="min-h-[calc(100vh-73px)]"
            currentPage={currentPage}
          />
        )}
        <main
          className={cn(
            "flex-1 relative",
            showSidebar ? "max-w-[calc(100vw-256px)]" : "w-full",
            className,
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
