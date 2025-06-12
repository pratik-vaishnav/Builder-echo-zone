import { Client } from "@stomp/stompjs";
import * as SockJS from "sockjs-client";
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
  private client: Client | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private subscribers: Map<string, Set<(message: any) => void>> = new Map();
  private useMock = false;

  constructor() {
    this.connect();
  }

  connect() {
    // Check if we should use mock (backend not available)
    if (this.useMock) {
      console.log("🔌 Using Mock WebSocket Service");
      return;
    }

    try {
      // Create STOMP client with SockJS
      this.client = new Client({
        webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
        connectHeaders: {
          // Add authentication headers if needed
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        debug: (str) => {
          console.log("🔌 WebSocket:", str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      this.client.onConnect = (frame) => {
        console.log("✅ WebSocket Connected:", frame);
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.subscribeToTopics();
      };

      this.client.onStompError = (frame) => {
        console.error("❌ WebSocket Error:", frame.headers["message"]);
        console.error("Additional details:", frame.body);
        this.handleReconnect();
      };

      this.client.onDisconnect = () => {
        console.log("📡 WebSocket Disconnected");
        this.isConnected = false;
        this.handleReconnect();
      };

      this.client.activate();
    } catch (error) {
      console.error("Failed to connect to WebSocket:", error);
      this.handleReconnect();
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `🔄 Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
      );
      setTimeout(() => this.connect(), 3000 * this.reconnectAttempts);
    } else {
      console.log(
        "⚠️ Max reconnection attempts reached. Falling back to mock WebSocket",
      );
      this.useMock = true;
      this.isConnected = true; // Mock is always "connected"
    }
  }

  private subscribeToTopics() {
    if (!this.client || !this.isConnected) return;

    // Subscribe to purchase request updates
    this.client.subscribe("/topic/purchase-requests", (message) => {
      const notification: NotificationMessage = JSON.parse(message.body);
      this.notifySubscribers("purchase-requests", notification);
      this.showBrowserNotification(notification);
    });

    // Subscribe to approval updates
    this.client.subscribe("/topic/approvals", (message) => {
      const notification: NotificationMessage = JSON.parse(message.body);
      this.notifySubscribers("approvals", notification);
      this.showBrowserNotification(notification);
    });

    // Subscribe to purchase order updates
    this.client.subscribe("/topic/purchase-orders", (message) => {
      const notification: NotificationMessage = JSON.parse(message.body);
      this.notifySubscribers("purchase-orders", notification);
      this.showBrowserNotification(notification);
    });

    // Subscribe to workflow updates
    this.client.subscribe("/topic/workflow", (message) => {
      const notification: NotificationMessage = JSON.parse(message.body);
      this.notifySubscribers("workflow", notification);
    });

    // Subscribe to dashboard statistics updates
    this.client.subscribe("/topic/dashboard/statistics", (message) => {
      const stats: StatisticsUpdate = JSON.parse(message.body);
      this.notifySubscribers("dashboard-statistics", stats);
    });

    // Subscribe to general dashboard updates
    this.client.subscribe("/topic/dashboard/updates", (message) => {
      const notification: NotificationMessage = JSON.parse(message.body);
      this.notifySubscribers("dashboard-updates", notification);
    });

    console.log("📡 Subscribed to all real-time topics");
  }

  subscribe(topic: string, callback: (message: any) => void) {
    // If using mock, delegate to mock service
    if (this.useMock) {
      return mockWebSocketService.subscribe(topic, callback);
    }

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
            `Error in subscriber callback for topic ${topic}:`,
            error,
          );
        }
      });
    }
  }

  private showBrowserNotification(notification: NotificationMessage) {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(notification.title, {
        body: notification.message,
        icon: "/favicon.svg",
        badge: "/favicon.svg",
        tag: notification.type,
      });
    }
  }

  sendMessage(destination: string, message: any) {
    if (this.useMock) {
      return mockWebSocketService.sendMessage(destination, message);
    }

    if (this.client && this.isConnected) {
      this.client.publish({
        destination,
        body: JSON.stringify(message),
      });
    } else {
      console.warn("WebSocket not connected. Message not sent:", message);
    }
  }

  disconnect() {
    if (this.useMock) {
      return mockWebSocketService.disconnect();
    }

    if (this.client) {
      this.client.deactivate();
      this.isConnected = false;
    }
  }

  isConnectedStatus() {
    if (this.useMock) {
      return mockWebSocketService.isConnectedStatus();
    }
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
export const webSocketService = new WebSocketService();

// Request notification permission on load
WebSocketService.requestNotificationPermission();

export default webSocketService;
