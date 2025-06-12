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

class MockWebSocketService {
  private isConnected = false;
  private subscribers: Map<string, Set<(message: any) => void>> = new Map();
  private mockData = {
    statistics: {
      totalRequests: 127,
      pendingRequests: 23,
      underReviewRequests: 8,
      approvedRequests: 45,
      rejectedRequests: 12,
      inProgressRequests: 18,
      completedRequests: 21,
      totalSpent: 2450000,
      pendingAmount: 875000,
      approvedAmount: 1250000,
      inProgressAmount: 650000,
      requestsThisWeek: 18,
      requestsThisMonth: 47,
      lastUpdated: new Date().toISOString(),
    },
  };

  constructor() {
    // Simulate connection after a short delay
    setTimeout(() => {
      this.isConnected = true;
      console.log("🔌 Mock WebSocket Connected");
      this.startMockUpdates();
    }, 1000);
  }

  private startMockUpdates() {
    // Mock statistics updates every 30 seconds
    setInterval(() => {
      this.mockData.statistics.totalRequests += Math.floor(Math.random() * 3);
      this.mockData.statistics.pendingRequests = Math.max(
        0,
        this.mockData.statistics.pendingRequests +
          Math.floor(Math.random() * 3) -
          1,
      );
      this.mockData.statistics.lastUpdated = new Date().toISOString();

      const statsUpdate: StatisticsUpdate = {
        type: "STATISTICS_UPDATE",
        statistics: this.mockData.statistics,
        timestamp: new Date().toISOString(),
      };

      this.notifySubscribers("dashboard-statistics", statsUpdate);
    }, 30000);

    // Mock occasional notifications
    setInterval(() => {
      const notifications = [
        {
          type: "PURCHASE_REQUEST_UPDATE",
          title: "New Purchase Request",
          message: "New laptop request for ₹1,25,000 created by John Doe",
          data: {},
          timestamp: new Date().toISOString(),
          action: "CREATED",
        },
        {
          type: "APPROVAL_UPDATE",
          title: "Request Approved",
          message: "Office supplies request approved for ₹25,000",
          data: {},
          timestamp: new Date().toISOString(),
          action: "APPROVED",
        },
        {
          type: "PURCHASE_ORDER_CREATED",
          title: "Purchase Order Created",
          message: "PO-2024-008 created with Dell Technologies",
          data: {},
          timestamp: new Date().toISOString(),
          action: "CREATED",
        },
      ];

      const randomNotification =
        notifications[Math.floor(Math.random() * notifications.length)];
      this.notifySubscribers("dashboard-updates", randomNotification);
    }, 45000);
  }

  subscribe(topic: string, callback: (message: any) => void) {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, new Set());
    }
    this.subscribers.get(topic)!.add(callback);

    // Send initial data for dashboard statistics
    if (topic === "dashboard-statistics" && this.isConnected) {
      setTimeout(() => {
        const statsUpdate: StatisticsUpdate = {
          type: "STATISTICS_UPDATE",
          statistics: this.mockData.statistics,
          timestamp: new Date().toISOString(),
        };
        callback(statsUpdate);
      }, 500);
    }

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
            `Error in mock subscriber callback for topic ${topic}:`,
            error,
          );
        }
      });
    }
  }

  sendMessage(destination: string, message: any) {
    console.log("📤 Mock WebSocket send:", destination, message);
  }

  disconnect() {
    this.isConnected = false;
    console.log("📡 Mock WebSocket Disconnected");
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
export const mockWebSocketService = new MockWebSocketService();

export default mockWebSocketService;
