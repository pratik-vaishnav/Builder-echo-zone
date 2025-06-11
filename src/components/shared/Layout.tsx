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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/8 to-indigo-600/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/8 to-pink-600/8 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/8 to-blue-600/8 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10">
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
    </div>
  );
};

export default Layout;
