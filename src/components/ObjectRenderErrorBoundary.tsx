import React, { Component, ErrorInfo, ReactNode } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * Error Boundary specifically for catching "Objects are not valid as a React child" errors
 * and other React rendering errors
 */
class ObjectRenderErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error("🚨 React Render Error Caught:", error);
    console.error("📍 Error Info:", errorInfo);

    // Check if it's the specific object rendering error
    if (error.message.includes("Objects are not valid as a React child")) {
      console.error(
        "💡 This is likely caused by trying to render an object directly in JSX.",
      );
      console.error(
        "🔧 Solution: Use object properties (obj.name) or convert to string with JSON.stringify() or String()",
      );
    }

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Update state with full error info
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="p-4 max-w-2xl mx-auto">
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold">
                  React Rendering Error: {this.state.error?.message}
                </p>
                {this.state.error?.message.includes(
                  "Objects are not valid as a React child",
                ) && (
                  <div className="text-sm">
                    <p className="mb-2">
                      🔍 <strong>Common causes:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>
                        Trying to render an object directly:{" "}
                        <code>{`{someObject}`}</code>
                      </li>
                      <li>
                        API returning object instead of string for text fields
                      </li>
                      <li>
                        Missing object property access: use{" "}
                        <code>{`{obj.name}`}</code> not <code>{`{obj}`}</code>
                      </li>
                      <li>Array containing objects instead of strings</li>
                    </ul>
                    <p className="mt-2 text-xs">
                      💡 <strong>Quick fix:</strong> Use{" "}
                      <code>String(value)</code> or{" "}
                      <code>value?.toString()</code> to convert objects to
                      strings.
                    </p>
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>

          <div className="flex gap-2">
            <Button onClick={this.handleReset} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="default"
              size="sm"
            >
              Reload Page
            </Button>
          </div>

          {process.env.NODE_ENV === "development" && (
            <details className="mt-4 p-4 bg-gray-100 rounded-lg">
              <summary className="cursor-pointer font-semibold text-sm">
                🛠️ Debug Information (Development Only)
              </summary>
              <div className="mt-2 space-y-2 text-xs">
                <div>
                  <strong>Error:</strong>
                  <pre className="bg-red-50 p-2 rounded mt-1 overflow-auto text-xs">
                    {this.state.error?.stack}
                  </pre>
                </div>
                {this.state.errorInfo && (
                  <div>
                    <strong>Component Stack:</strong>
                    <pre className="bg-blue-50 p-2 rounded mt-1 overflow-auto text-xs">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ObjectRenderErrorBoundary;

// Higher-Order Component version for easy wrapping
export function withObjectRenderErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: ReactNode,
) {
  const WithErrorBoundary = (props: P) => (
    <ObjectRenderErrorBoundary fallback={fallback}>
      <WrappedComponent {...props} />
    </ObjectRenderErrorBoundary>
  );

  WithErrorBoundary.displayName = `withObjectRenderErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithErrorBoundary;
}

// Hook for programmatic error handling
export function useObjectRenderSafety() {
  const safeRender = (value: any): string => {
    if (value === null || value === undefined) return "";
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return String(value);
    }
    if (typeof value === "object") {
      if (value.name) return String(value.name);
      if (value.title) return String(value.title);
      if (value.label) return String(value.label);
      return "[Object]";
    }
    return String(value);
  };

  const safeDepartments = (departments: any[]): string[] => {
    if (!Array.isArray(departments)) return [];
    return departments
      .map((dept) => {
        if (typeof dept === "string") return dept;
        if (typeof dept === "object" && dept?.name) return dept.name;
        return String(dept);
      })
      .filter(Boolean);
  };

  return {
    safeRender,
    safeDepartments,
  };
}
