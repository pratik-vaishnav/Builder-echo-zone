import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import ProcureFlowIcon from "./ProcureFlowIcon";

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
      <ProcureFlowIcon
        size={size === "sm" ? "sm" : size === "md" ? "md" : "lg"}
        className="group-hover:shadow-xl transition-all duration-300 group-hover:scale-105"
      />

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <h1
            className={cn(
              "text-gray-900 font-bold tracking-tight group-hover:text-indigo-600 transition-colors",
              sizeClasses[size].text,
            )}
          >
            ProcureFlow
          </h1>
          <p className="text-xs text-gray-500 font-medium tracking-wide">
            Smart Procurement Platform
          </p>
        </div>
      )}
    </Link>
  );
};

export default Logo;
