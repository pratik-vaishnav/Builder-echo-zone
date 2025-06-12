import { mockWebSocketService } from "./mockWebSocket";

export interface NotificationMessage {
  type: string;
  title: string;
  message: string;
  data: any;
  timestamp: string;
  action: string;
  priority?: string;
  userId?: string;
}

export interface StatisticsUpdate {
  type: string;
  statistics: Record<string, any>;
  timestamp: string;
}

class WebSocketService {
  private isConnected = false;
  private useMock = true; // Start with mock by default
  private subscribers: Map<string, Set<(message: any) => void>> = new Map();

  constructor() {
    // Always use mock for now to avoid sockjs-client issues
    console.log(
      "🔌 Using Mock WebSocket Service (sockjs-client compatibility mode)",
    );
    this.isConnected = true;
  }

  subscribe(topic: string, callback: (message: any) => void) {
    // Always delegate to mock service for compatibility
    return mockWebSocketService.subscribe(topic, callback);
  }

  private notifySubscribers(topic: string, message: any) {
    const topicSubscribers = this.subscribers.get(topic);
    if (topicSubscribers) {
      topicSubscribers.forEach((callback) => {
        try {
          callback(message);
        } catch (error) {
          console.error(
            `Error in subscriber callback for topic ${topic}:`,
            error,
          );
        }
      });
    }
  }

  sendMessage(destination: string, message: any) {
    return mockWebSocketService.sendMessage(destination, message);
  }

  disconnect() {
    return mockWebSocketService.disconnect();
  }

  isConnectedStatus() {
    return mockWebSocketService.isConnectedStatus();
  }

  // Request browser notification permission
  static async requestNotificationPermission() {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }
    return false;
  }

  // Method to try upgrading to real WebSocket when backend is available
  async tryUpgradeToRealWebSocket() {
    try {
      // Check if backend is available first
      const response = await fetch("http://localhost:8080/actuator/health", {
        method: "GET",
        signal: AbortSignal.timeout(3000),
      });

      if (response.ok) {
        console.log(
          "✅ Backend is available, but staying with mock WebSocket for compatibility",
        );
        // We could implement real WebSocket here, but for now stick with mock
        // to avoid the sockjs-client global issue
      }
    } catch (error) {
      console.log("Backend not available, continuing with mock WebSocket");
    }
  }
}

// Create singleton instance
export const webSocketService = new WebSocketService();

// Request notification permission on load
WebSocketService.requestNotificationPermission();

// Try to upgrade to real WebSocket after a delay
setTimeout(() => {
  webSocketService.tryUpgradeToRealWebSocket();
}, 2000);

export default webSocketService;
