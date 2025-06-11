import { Package } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const Logo = ({ className, showText = true, size = "md" }: LogoProps) => {
  const sizeClasses = {
    sm: {
      container: "h-6 w-6",
      icon: "h-4 w-4",
      text: "text-lg font-semibold",
    },
    md: {
      container: "h-8 w-8",
      icon: "h-5 w-5",
      text: "text-xl font-semibold",
    },
    lg: {
      container: "h-12 w-12",
      icon: "h-7 w-7",
      text: "text-2xl font-bold",
    },
  };

  return (
    <Link
      to="/dashboard"
      className={cn("flex items-center space-x-3 group", className)}
    >
      {/* Logo Icon */}
      <div
        className={cn(
          "bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105",
          sizeClasses[size].container,
        )}
      >
        <Package className={cn("text-white", sizeClasses[size].icon)} />
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <h1
            className={cn(
              "text-gray-900 font-bold tracking-tight group-hover:text-indigo-600 transition-colors",
              sizeClasses[size].text,
            )}
          >
            Purchase Manager
          </h1>
          <p className="text-xs text-gray-500 font-medium tracking-wide">
            Procurement System
          </p>
        </div>
      )}
    </Link>
  );
};

export default Logo;
