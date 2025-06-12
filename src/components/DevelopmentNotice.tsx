import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Info,
  Server,
  Database,
  Wifi,
  Code,
  Play,
  X,
  CheckCircle,
} from "lucide-react";
import { backendHealthChecker } from "@/utils/backendHealth";

const DevelopmentNotice = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [backendStatus, setBackendStatus] = useState<{
    isAvailable: boolean;
    message: string;
  }>({ isAvailable: false, message: "Checking..." });

  useEffect(() => {
    // Check if user has dismissed the notice
    const dismissed = localStorage.getItem("dev-notice-dismissed");
    if (!dismissed) {
      setIsVisible(true);
    }

    // Check backend status
    const checkStatus = async () => {
      const status = await backendHealthChecker.checkHealth();
      setBackendStatus(status);
    };
    checkStatus();
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("dev-notice-dismissed", "true");
  };

  const handleStartBackend = () => {
    // Open backend README in new tab
    window.open("/backend/README.md", "_blank");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-96">
      <Card className="shadow-lg border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Info className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Development Mode</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <Alert className="bg-white border-blue-200">
              <AlertDescription className="text-sm">
                <strong>ProcureFlow</strong> is running in development mode with
                mock data and simulated real-time features.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Wifi className="h-4 w-4 text-green-600" />
                  <span>Frontend</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">Running</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Server className="h-4 w-4 text-blue-600" />
                  <span>Backend API</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      backendStatus.isAvailable
                        ? "bg-green-500"
                        : "bg-orange-500"
                    }`}
                  ></div>
                  <span
                    className={
                      backendStatus.isAvailable
                        ? "text-green-600"
                        : "text-orange-600"
                    }
                  >
                    {backendStatus.isAvailable ? "Connected" : "Offline"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Database className="h-4 w-4 text-purple-600" />
                  <span>Real-time Data</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                  <span className="text-blue-600">Mock/Simulated</span>
                </div>
              </div>
            </div>

            {!backendStatus.isAvailable && (
              <div className="pt-2 border-t border-blue-200">
                <p className="text-xs text-blue-700 mb-2">
                  To enable full features, start the Java backend:
                </p>
                <div className="bg-gray-800 text-green-400 p-2 rounded text-xs font-mono">
                  cd backend && mvn spring-boot:run
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStartBackend}
                  className="mt-2 text-xs"
                >
                  <Code className="h-3 w-3 mr-1" />
                  View Backend Setup
                </Button>
              </div>
            )}

            <div className="pt-2 border-t border-blue-200">
              <div className="text-xs text-blue-700">
                <strong>Current Features:</strong>
                <ul className="mt-1 space-y-1 ml-4 list-disc">
                  <li>✅ Complete UI with Indian Rupee (₹) currency</li>
                  <li>✅ Mock real-time updates and notifications</li>
                  <li>✅ Simulated workflow automation</li>
                  <li>✅ Responsive design and modern interface</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DevelopmentNotice;
