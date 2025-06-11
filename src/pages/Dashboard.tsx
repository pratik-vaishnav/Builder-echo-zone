import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  CheckCircle,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/shared/Layout";

const statsData = [
  {
    title: "Total Requests",
    value: "127",
    change: "+12%",
    trend: "up",
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Pending Approvals",
    value: "23",
    change: "-5%",
    trend: "down",
    icon: CheckCircle,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    title: "Active Orders",
    value: "45",
    change: "+18%",
    trend: "up",
    icon: ShoppingCart,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Total Spent",
    value: "$125K",
    change: "+23%",
    trend: "up",
    icon: DollarSign,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
];

const recentActivities = [
  {
    title: "New purchase request submitted",
    user: "Alice Johnson",
    time: "2 hours ago",
    type: "request",
  },
  {
    title: "Order PO-2024-015 approved",
    user: "Bob Smith",
    time: "4 hours ago",
    type: "approval",
  },
  {
    title: "Payment processed for PO-2024-012",
    user: "Finance Team",
    time: "6 hours ago",
    type: "payment",
  },
  {
    title: "Supplier quote received",
    user: "Carol Williams",
    time: "1 day ago",
    type: "quote",
  },
];

const Dashboard = () => {
  return (
    <Layout currentPage="dashboard">
      <div className="page-container">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to ProcureFlow, John!
          </h1>
          <p className="text-gray-600 text-lg">
            Your smart procurement workflow dashboard - track requests,
            approvals, and orders in real-time.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <Card
              key={index}
              className="card-shadow hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {stat.value}
                    </p>
                    <div className="flex items-center">
                      <TrendingUp
                        className={`h-4 w-4 mr-1 ${
                          stat.trend === "up"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      />
                      <span
                        className={`text-sm font-semibold ${
                          stat.trend === "up"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">
                        from last month
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Quick Actions
                </h2>
              </div>
              <div className="space-y-4">
                <Link to="/submit-request">
                  <Button className="w-full justify-between btn-gradient shadow-lg hover:shadow-xl transition-all">
                    Submit New Request
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/approve-requests">
                  <Button
                    variant="outline"
                    className="w-full justify-between hover:bg-gray-50"
                  >
                    Review Pending Approvals
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/purchase-orders">
                  <Button
                    variant="outline"
                    className="w-full justify-between hover:bg-gray-50"
                  >
                    View All Orders
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2 card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Activity
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.user} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="card-shadow">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Monthly Spending Trend
              </h3>
              <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex flex-col items-center justify-center shadow-inner">
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">
                    $125,420
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    Total this month
                  </div>
                  <div className="flex items-center justify-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-indigo-600 rounded-full mr-2"></div>
                      <span className="font-medium">Approved</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-orange-400 rounded-full mr-2"></div>
                      <span className="font-medium">Pending</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Request Status Overview
              </h3>
              <div className="h-64 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 shadow-inner">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Approved
                    </span>
                    <span className="text-sm font-semibold text-green-600">
                      68%
                    </span>
                  </div>
                  <div className="w-full bg-white rounded-full h-3 shadow-inner">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm"
                      style={{ width: "68%" }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Pending
                    </span>
                    <span className="text-sm font-semibold text-orange-600">
                      22%
                    </span>
                  </div>
                  <div className="w-full bg-white rounded-full h-3 shadow-inner">
                    <div
                      className="bg-gradient-to-r from-orange-400 to-orange-500 h-3 rounded-full shadow-sm"
                      style={{ width: "22%" }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Rejected
                    </span>
                    <span className="text-sm font-semibold text-red-600">
                      10%
                    </span>
                  </div>
                  <div className="w-full bg-white rounded-full h-3 shadow-inner">
                    <div
                      className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full shadow-sm"
                      style={{ width: "10%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
