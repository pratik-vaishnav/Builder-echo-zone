import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  CheckCircle,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  ArrowRight,
  Zap,
  Clock,
  Activity,
  Bell,
} from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/shared/Layout";
import webSocketService, {
  NotificationMessage,
  StatisticsUpdate,
} from "@/services/websocket";
import { formatCurrency, formatCompactCurrency } from "@/utils/currency";

interface Statistics {
  totalRequests?: number;
  pendingRequests?: number;
  underReviewRequests?: number;
  approvedRequests?: number;
  rejectedRequests?: number;
  inProgressRequests?: number;
  completedRequests?: number;
  totalSpent?: number;
  pendingAmount?: number;
  approvedAmount?: number;
  inProgressAmount?: number;
  requestsThisWeek?: number;
  requestsThisMonth?: number;
  lastUpdated?: string;
}

const Dashboard = () => {
  const [statistics, setStatistics] = useState<Statistics>({});
  const [recentNotifications, setRecentNotifications] = useState<
    NotificationMessage[]
  >([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());

  useEffect(() => {
    // Check WebSocket connection status
    setIsConnected(webSocketService.isConnectedStatus());

    // Subscribe to real-time statistics updates
    const unsubscribeStats = webSocketService.subscribe(
      "dashboard-statistics",
      (update: StatisticsUpdate) => {
        console.log("📊 Real-time statistics update:", update);
        setStatistics(update.statistics);
        setLastUpdateTime(new Date());
      },
    );

    // Subscribe to dashboard notifications
    const unsubscribeNotifications = webSocketService.subscribe(
      "dashboard-updates",
      (notification: NotificationMessage) => {
        console.log("🔔 Dashboard notification:", notification);
        setRecentNotifications((prev) => [notification, ...prev.slice(0, 4)]); // Keep last 5 notifications
      },
    );

    // Load initial statistics
    loadInitialStatistics();

    // Cleanup subscriptions
    return () => {
      unsubscribeStats();
      unsubscribeNotifications();
    };
  }, []);

  const loadInitialStatistics = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8080/api/purchase-requests/statistics",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setStatistics(data);
        setLastUpdateTime(new Date());
      }
    } catch (error) {
      console.error("Failed to load initial statistics:", error);
    }
  };

  const statsData = [
    {
      title: "Total Requests",
      value: statistics.totalRequests || 0,
      change: `+${statistics.requestsThisWeek || 0} this week`,
      trend: "up",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      amount: null,
    },
    {
      title: "Pending Approvals",
      value:
        (statistics.pendingRequests || 0) +
        (statistics.underReviewRequests || 0),
      change: "Requires attention",
      trend: "neutral",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      amount: statistics.pendingAmount || 0,
    },
    {
      title: "Active Orders",
      value:
        (statistics.approvedRequests || 0) +
        (statistics.inProgressRequests || 0),
      change: "In progress",
      trend: "up",
      icon: ShoppingCart,
      color: "text-green-600",
      bgColor: "bg-green-50",
      amount:
        (statistics.approvedAmount || 0) + (statistics.inProgressAmount || 0),
    },
    {
      title: "Total Spent",
      value: formatCompactCurrency(statistics.totalSpent || 0),
      change: `${statistics.completedRequests || 0} completed`,
      trend: "up",
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      amount: statistics.totalSpent || 0,
    },
  ];

  const quickActions = [
    {
      title: "Submit New Request",
      description: "Create a new purchase request",
      icon: FileText,
      link: "/submit-request",
      color: "bg-blue-600",
    },
    {
      title: "Approve Requests",
      description: "Review pending approvals",
      icon: CheckCircle,
      link: "/approve-requests",
      color: "bg-green-600",
      badge:
        (statistics.pendingRequests || 0) +
        (statistics.underReviewRequests || 0),
    },
    {
      title: "View Orders",
      description: "Track purchase orders",
      icon: ShoppingCart,
      link: "/purchase-orders",
      color: "bg-purple-600",
    },
    {
      title: "Analytics",
      description: "View detailed reports",
      icon: TrendingUp,
      link: "/analytics",
      color: "bg-orange-600",
    },
  ];

  return (
    <Layout currentPage="dashboard">
      <div className="min-h-screen p-6 space-y-6">
        {/* Header with Real-time Status */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Real-time Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Live procurement insights and analytics
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
              ></div>
              <span className="text-sm text-gray-600">
                {isConnected ? "Live" : "Offline"}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Last updated: {lastUpdateTime.toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Real-time Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <Card
              key={index}
              className="card-modern hover:shadow-xl transition-all duration-300 group"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  {stat.trend === "up" && (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  )}
                  {isConnected && (
                    <Activity className="h-4 w-4 text-green-500 animate-pulse" />
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {typeof stat.value === "string"
                      ? stat.value
                      : stat.value.toLocaleString()}
                  </p>
                  {stat.amount && stat.amount > 0 && (
                    <p className="text-sm text-gray-500">
                      {formatCurrency(stat.amount)}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">{stat.change}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="card-modern">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Quick Actions
                  </h3>
                  <Zap className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <Link key={index} to={action.link}>
                      <div className="p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-200 group cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                          <div
                            className={`p-2 rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform duration-200`}
                          >
                            <action.icon className="h-5 w-5" />
                          </div>
                          {action.badge && action.badge > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              {action.badge}
                            </span>
                          )}
                          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-200" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {action.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {action.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Activity Feed */}
          <div>
            <Card className="card-modern">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Live Activity
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-indigo-600" />
                    {isConnected && (
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  {recentNotifications.length > 0 ? (
                    recentNotifications.map((notification, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg bg-gray-50 border-l-4 border-indigo-500"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {notification.message}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(
                              notification.timestamp,
                            ).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">
                        {isConnected
                          ? "Waiting for real-time updates..."
                          : "Connect to see live activity"}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Monthly Overview */}
        <Card className="card-modern">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                This Month Overview
              </h3>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-lg bg-blue-50">
                <p className="text-2xl font-bold text-blue-600">
                  {statistics.requestsThisMonth || 0}
                </p>
                <p className="text-sm text-gray-600">Requests Created</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-green-50">
                <p className="text-2xl font-bold text-green-600">
                  {formatCompactCurrency(
                    (statistics.approvedAmount || 0) +
                      (statistics.totalSpent || 0),
                  )}
                </p>
                <p className="text-sm text-gray-600">Total Processing</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-purple-50">
                <p className="text-2xl font-bold text-purple-600">
                  {(
                    ((statistics.completedRequests || 0) /
                      Math.max(statistics.totalRequests || 1, 1)) *
                    100
                  ).toFixed(1)}
                  %
                </p>
                <p className="text-sm text-gray-600">Completion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
