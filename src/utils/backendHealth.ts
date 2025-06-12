/**
 * Backend Health Check Utility
 * Helps determine if the Java backend is available
 */

interface HealthStatus {
  isAvailable: boolean;
  message: string;
  lastChecked: Date;
}

class BackendHealthChecker {
  private lastCheck: HealthStatus | null = null;
  private checkInterval: number = 30000; // 30 seconds

  async checkHealth(): Promise<HealthStatus> {
    try {
      const response = await fetch("http://localhost:8080/actuator/health", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Add timeout
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const healthData = await response.json();
        this.lastCheck = {
          isAvailable: true,
          message: `Backend is healthy (${healthData.status || "UP"})`,
          lastChecked: new Date(),
        };
      } else {
        this.lastCheck = {
          isAvailable: false,
          message: `Backend returned ${response.status}: ${response.statusText}`,
          lastChecked: new Date(),
        };
      }
    } catch (error) {
      this.lastCheck = {
        isAvailable: false,
        message:
          error instanceof Error
            ? `Backend not available: ${error.message}`
            : "Backend connection failed",
        lastChecked: new Date(),
      };
    }

    return this.lastCheck;
  }

  getLastCheckResult(): HealthStatus | null {
    return this.lastCheck;
  }

  startPeriodicCheck(callback?: (status: HealthStatus) => void): () => void {
    const interval = setInterval(async () => {
      const status = await this.checkHealth();
      if (callback) {
        callback(status);
      }
    }, this.checkInterval);

    // Initial check
    this.checkHealth().then((status) => {
      if (callback) {
        callback(status);
      }
    });

    // Return cleanup function
    return () => clearInterval(interval);
  }

  async waitForBackend(
    maxAttempts: number = 10,
    delayMs: number = 2000,
  ): Promise<boolean> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(
        `🔍 Checking backend availability (attempt ${attempt}/${maxAttempts})`,
      );

      const status = await this.checkHealth();
      if (status.isAvailable) {
        console.log("✅ Backend is available!");
        return true;
      }

      if (attempt < maxAttempts) {
        console.log(`⏳ Backend not ready, waiting ${delayMs}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    console.log("❌ Backend is not available after maximum attempts");
    return false;
  }
}

// Create singleton instance
export const backendHealthChecker = new BackendHealthChecker();

// Utility function to check if backend is running
export const isBackendAvailable = async (): Promise<boolean> => {
  const status = await backendHealthChecker.checkHealth();
  return status.isAvailable;
};

// Show backend status in console
export const logBackendStatus = async (): Promise<void> => {
  const status = await backendHealthChecker.checkHealth();
  const icon = status.isAvailable ? "✅" : "❌";
  console.log(`${icon} Backend Status: ${status.message}`);
};

export default backendHealthChecker;
