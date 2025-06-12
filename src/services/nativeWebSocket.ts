/**
 * Native WebSocket Service
 * Browser-native WebSocket implementation without external dependencies
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

class NativeWebSocketService {
  private ws: WebSocket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private subscribers: Map<string, Set<(message: any) => void>> = new Map();
  private reconnectTimeout: number | null = null;

  constructor() {
    this.connect();
  }

  private connect() {
    try {
      // Try to connect to the backend WebSocket
      this.ws = new WebSocket("ws://localhost:8080/websocket");

      this.ws.onopen = () => {
        console.log("✅ Native WebSocket Connected");
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.sendHeartbeat();
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
        console.log("📡 Native WebSocket Disconnected");
        this.isConnected = false;
        this.handleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error("❌ Native WebSocket Error:", error);
        this.handleReconnect();
      };
    } catch (error) {
      console.error("Failed to create native WebSocket:", error);
      this.handleReconnect();
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = 3000 * this.reconnectAttempts;

      console.log(
        `🔄 Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`,
      );

      this.reconnectTimeout = window.setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      console.log(
        "⚠️ Max reconnection attempts reached. WebSocket service unavailable.",
      );
    }
  }

  private sendHeartbeat() {
    if (this.isConnected && this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: "heartbeat",
          timestamp: new Date().toISOString(),
        }),
      );

      // Schedule next heartbeat
      setTimeout(() => this.sendHeartbeat(), 30000);
    }
  }

  private handleMessage(message: any) {
    // Route message to appropriate subscribers based on type
    const topic = this.getTopicFromMessageType(message.type);
    this.notifySubscribers(topic, message);
  }

  private getTopicFromMessageType(type: string): string {
    if (type.includes("PURCHASE_REQUEST")) return "purchase-requests";
    if (type.includes("APPROVAL")) return "approvals";
    if (type.includes("PURCHASE_ORDER")) return "purchase-orders";
    if (type.includes("WORKFLOW")) return "workflow";
    if (type.includes("STATISTICS")) return "dashboard-statistics";
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
            `Error in native WebSocket subscriber callback for topic ${topic}:`,
            error,
          );
        }
      });
    }
  }

  sendMessage(destination: string, message: any) {
    if (this.isConnected && this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          destination,
          ...message,
          timestamp: new Date().toISOString(),
        }),
      );
    } else {
      console.warn(
        "Native WebSocket not connected. Message not sent:",
        message,
      );
    }
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.isConnected = false;
  }

  isConnectedStatus() {
    return this.isConnected;
  }

  static async requestNotificationPermission() {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }
    return false;
  }
}

// Create singleton instance
export const nativeWebSocketService = new NativeWebSocketService();

export default nativeWebSocketService;
