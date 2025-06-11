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

const SidebarItem = ({
  icon: Icon,
  label,
  isActive = false,
  to,
}: {
  icon: any;
  label: string;
  isActive?: boolean;
  to?: string;
}) => {
  const content = (
    <div
      className={cn(
        "w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors",
        isActive
          ? "bg-indigo-600 text-white"
          : "text-gray-700 hover:bg-gray-100",
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium">{label}</span>
    </div>
  );

  return to ? <Link to={to}>{content}</Link> : <button>{content}</button>;
};

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                Purchase Manager
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <span className="text-indigo-600 font-medium border-b-2 border-indigo-600 pb-2">
                Dashboard
              </span>
              <Link
                to="/purchase-requests"
                className="text-gray-500 hover:text-gray-700"
              >
                Purchase Requests
              </Link>
              <Link
                to="/approve-requests"
                className="text-gray-500 hover:text-gray-700"
              >
                Approve Requests
              </Link>
              <Link
                to="/purchase-orders"
                className="text-gray-500 hover:text-gray-700"
              >
                Purchase Orders
              </Link>
            </nav>
          </div>
          <Link to="/profile">
            <Avatar>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-indigo-100 text-indigo-600">
                JD
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)]">
          <div className="p-4 space-y-2">
            <SidebarItem icon={Building2} label="Dashboard" isActive={true} />
            <SidebarItem
              icon={FileText}
              label="Purchase Requests"
              to="/purchase-requests"
            />
            <SidebarItem
              icon={CheckCircle}
              label="Approve Requests"
              to="/approve-requests"
            />
            <SidebarItem
              icon={Package}
              label="Purchase Orders"
              to="/purchase-orders"
            />
          </div>
          <div className="absolute bottom-4 left-4 space-y-2">
            <SidebarItem icon={User} label="User Profile" to="/profile" />
            <SidebarItem icon={Settings} label="Settings" />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back, John!
              </h2>
              <p className="text-gray-600">
                Here's what's happening with your procurement system today.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statsData.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          {stat.value}
                        </p>
                        <div className="flex items-center mt-2">
                          <TrendingUp
                            className={`h-4 w-4 mr-1 ${
                              stat.trend === "up"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          />
                          <span
                            className={`text-sm font-medium ${
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
                      <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Quick Actions
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <Link to="/submit-request">
                      <Button className="w-full justify-between bg-indigo-600 hover:bg-indigo-700">
                        Submit New Request
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to="/approve-requests">
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                      >
                        Review Pending Approvals
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to="/purchase-orders">
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                      >
                        View All Orders
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="lg:col-span-2">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Recent Activity
                    </h3>
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
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
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Monthly Spending Trend
                  </h3>
                  <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex flex-col items-center justify-center">
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
                          <span>Approved</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-orange-400 rounded-full mr-2"></div>
                          <span>Pending</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Request Status Overview
                  </h3>
                  <div className="h-64 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Approved
                        </span>
                        <span className="text-sm font-semibold text-green-600">
                          68%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
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
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-400 h-2 rounded-full"
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
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
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