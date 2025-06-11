import { cn } from "@/lib/utils";

interface ProcureFlowIconProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "solid" | "outline";
}

const ProcureFlowIcon = ({
  className,
  size = "md",
  variant = "solid",
}: ProcureFlowIconProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  if (variant === "outline") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(sizeClasses[size], className)}
      >
        <rect width="8" height="8" x="3" y="3" rx="2" />
        <path d="M7 11v4a2 2 0 0 0 2 2h4" />
        <rect width="8" height="8" x="13" y="13" rx="2" />
      </svg>
    );
  }

  return (
    <div
      className={cn(
        "bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg",
        sizeClasses[size],
        className,
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(
          size === "sm"
            ? "h-2.5 w-2.5"
            : size === "md"
              ? "h-4 w-4"
              : size === "lg"
                ? "h-5 w-5"
                : "h-7 w-7",
        )}
      >
        <rect width="8" height="8" x="3" y="3" rx="2" />
        <path d="M7 11v4a2 2 0 0 0 2 2h4" />
        <rect width="8" height="8" x="13" y="13" rx="2" />
      </svg>
    </div>
  );
};

export default ProcureFlowIcon;
