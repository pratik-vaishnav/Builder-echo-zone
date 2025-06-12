/**
 * Real WebSocket Service for Backend Integration
 * Connects to Spring Boot WebSocket endpoint
 */

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

class RealWebSocketService {
  private ws: WebSocket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private subscribers: Map<string, Set<(message: any) => void>> = new Map();
  private reconnectTimeout: number | null = null;
  private heartbeatInterval: number | null = null;

  constructor() {
    this.connect();
  }

  private connect() {
    try {
      // Connect to Spring Boot WebSocket endpoint
      this.ws = new WebSocket("ws://localhost:8080/websocket");

      this.ws.onopen = () => {
        console.log("✅ Real WebSocket Connected to Backend");
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.startHeartbeat();
        this.subscribeToTopics();
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      this.ws.onclose = () => {
        console.log("📡 Real WebSocket Disconnected");
        this.isConnected = false;
        this.stopHeartbeat();
        this.handleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error("❌ Real WebSocket Error:", error);
        this.handleReconnect();
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      this.handleReconnect();
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(5000 * this.reconnectAttempts, 30000);

      console.log(
        `🔄 Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`,
      );

      this.reconnectTimeout = window.setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      console.log(
        "❌ Max reconnection attempts reached. WebSocket service unavailable.",
      );
    }
  }

  private startHeartbeat() {
    this.heartbeatInterval = window.setInterval(() => {
      if (this.isConnected && this.ws?.readyState === WebSocket.OPEN) {
        this.sendMessage("/app/heartbeat", {
          type: "heartbeat",
          timestamp: new Date().toISOString(),
        });
      }
    }, 30000);
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private subscribeToTopics() {
    // Send subscription messages to backend
    const subscriptions = [
      "/app/subscribe/purchase-requests",
      "/app/subscribe/dashboard",
      "/app/subscribe/approvals",
      "/app/subscribe/purchase-orders",
    ];

    subscriptions.forEach((topic) => {
      this.sendMessage(topic, { action: "subscribe" });
    });
  }

  private handleMessage(message: any) {
    // Route message to appropriate subscribers based on type
    const topic = this.getTopicFromMessageType(message.type);
    this.notifySubscribers(topic, message);

    // Broadcast to dashboard updates as well
    if (topic !== "dashboard-updates") {
      this.notifySubscribers("dashboard-updates", message);
    }
  }

  private getTopicFromMessageType(type: string): string {
    if (type?.includes("PURCHASE_REQUEST")) return "purchase-requests";
    if (type?.includes("APPROVAL")) return "approvals";
    if (type?.includes("PURCHASE_ORDER")) return "purchase-orders";
    if (type?.includes("WORKFLOW")) return "workflow";
    if (type?.includes("STATISTICS")) return "dashboard-statistics";
    return "dashboard-updates";
  }

  subscribe(topic: string, callback: (message: any) => void) {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, new Set());
    }
    this.subscribers.get(topic)!.add(callback);

    // Return unsubscribe function
    return () => {
      const topicSubscribers = this.subscribers.get(topic);
      if (topicSubscribers) {
        topicSubscribers.delete(callback);
        if (topicSubscribers.size === 0) {
          this.subscribers.delete(topic);
        }
      }
    };
  }

  private notifySubscribers(topic: string, message: any) {
    const topicSubscribers = this.subscribers.get(topic);
    if (topicSubscribers) {
      topicSubscribers.forEach((callback) => {
        try {
          callback(message);
        } catch (error) {
          console.error(
            `Error in WebSocket subscriber callback for topic ${topic}:`,
            error,
          );
        }
      });
    }
  }

  sendMessage(destination: string, message: any) {
    if (this.isConnected && this.ws?.readyState === WebSocket.OPEN) {
      const payload = {
        destination,
        body: JSON.stringify({
          ...message,
          timestamp: new Date().toISOString(),
        }),
      };
      this.ws.send(JSON.stringify(payload));
    } else {
      console.warn("WebSocket not connected. Message not sent:", message);
    }
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    this.stopHeartbeat();

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.isConnected = false;
  }

  isConnectedStatus() {
    return this.isConnected;
  }

  // Request browser notification permission
  static async requestNotificationPermission() {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }
    return false;
  }
}

// Create singleton instance
export const webSocketService = new RealWebSocketService();

// Request notification permission on load
RealWebSocketService.requestNotificationPermission();

export default webSocketService;
