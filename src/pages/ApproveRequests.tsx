import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Filter,
  Plus,
  Clock,
  AlertTriangle,
  FileText,
  CheckCircle,
  XCircle,
  Package,
  Settings,
  User,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

// Mock data
const statsData = [
  {
    title: "Pending Approvals",
    value: "12",
    subtitle: "Requests awaiting your review",
    icon: Clock,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
  {
    title: "High Priority",
    value: "3",
    subtitle: "Urgent requests pending",
    icon: AlertTriangle,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
  {
    title: "Overdue Requests",
    value: "1",
    subtitle: "Past due date",
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    title: "Recently Approved",
    value: "8",
    subtitle: "Approved in the last 24 hours",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
];

const pendingRequests = [
  {
    id: "PR-001",
    requester: "Alice Johnson",
    department: "Marketing",
    date: "2024-07-28",
    amount: "$1,200.00",
    priority: "High",
    priorityColor: "bg-red-100 text-red-800",
  },
  {
    id: "PR-002",
    requester: "Bob Williams",
    department: "Sales",
    date: "2024-07-27",
    amount: "$350.00",
    priority: "Medium",
    priorityColor: "bg-orange-100 text-orange-800",
  },
  {
    id: "PR-003",
    requester: "Charlie Green",
    department: "HR",
    date: "2024-07-26",
    amount: "$5,000.00",
    priority: "High",
    priorityColor: "bg-red-100 text-red-800",
  },
  {
    id: "PR-004",
    requester: "Diana Prince",
    department: "IT",
    date: "2024-07-25",
    amount: "$7,500.00",
    priority: "High",
    priorityColor: "bg-red-100 text-red-800",
  },
  {
    id: "PR-005",
    requester: "Eve Adams",
    department: "Operations",
    date: "2024-07-24",
    amount: "$800.00",
    priority: "Medium",
    priorityColor: "bg-orange-100 text-orange-800",
  },
  {
    id: "PR-006",
    requester: "Frank White",
    department: "Finance",
    date: "2024-07-23",
    amount: "$2,100.00",
    priority: "Low",
    priorityColor: "bg-blue-100 text-blue-800",
  },
  {
    id: "PR-007",
    requester: "Grace Hall",
    department: "Marketing",
    date: "2024-07-22",
    amount: "$450.00",
    priority: "Medium",
    priorityColor: "bg-orange-100 text-orange-800",
  },
  {
    id: "PR-008",
    requester: "Henry King",
    department: "Sales",
    date: "2024-07-21",
    amount: "$1,500.00",
    priority: "High",
    priorityColor: "bg-red-100 text-red-800",
  },
  {
    id: "PR-009",
    requester: "Ivy Queen",
    department: "HR",
    date: "2024-07-20",
    amount: "$600.00",
    priority: "Low",
    priorityColor: "bg-blue-100 text-blue-800",
  },
  {
    id: "PR-010",
    requester: "Jack Black",
    department: "IT",
    date: "2024-07-19",
    amount: "$3,200.00",
    priority: "Medium",
    priorityColor: "bg-orange-100 text-orange-800",
  },
];

const recentActivity = [
  {
    user: "Alice Johnson",
    action: "approved request",
    time: "1 hour ago",
    type: "approved",
  },
  {
    user: "Bob Williams",
    action: "rejected request",
    time: "3 hours ago",
    type: "rejected",
  },
  {
    user: "Charlie Green",
    action: "approved request",
    time: "1 day ago",
    type: "approved",
  },
  {
    user: "Diana Prince",
    action: "approved request",
    time: "2 days ago",
    type: "approved",
  },
  {
    user: "Eve Adams",
    action: "rejected request",
    time: "3 days ago",
    type: "rejected",
  },
];

const departmentData = [
  { name: "IT", value: 8 },
  { name: "Marketing", value: 6 },
  { name: "HR", value: 4 },
  { name: "Operations", value: 3 },
  { name: "Finance", value: 2 },
  { name: "Sales", value: 5 },
];

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

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  bgColor,
  borderColor,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
}) => (
  <Card className={cn("border-l-4", borderColor)}>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className={cn("p-3 rounded-lg", bgColor)}>
          <Icon className={cn("h-6 w-6", color)} />
        </div>
      </div>
    </CardContent>
  </Card>
);

const ApproveRequests = () => {
  const [searchTerm, setSearchTerm] = useState("");

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
              <Link
                to="/purchase-requests"
                className="text-gray-500 hover:text-gray-700"
              >
                Purchase Requests
              </Link>
              <span className="text-indigo-600 font-medium border-b-2 border-indigo-600 pb-2">
                Approve Requests
              </span>
              <Link
                to="/purchase-orders"
                className="text-gray-500 hover:text-gray-700"
              >
                Purchase Orders
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search requests..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
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
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)]">
          <div className="p-4 space-y-2">
            <SidebarItem icon={Building2} label="Dashboard" />
            <SidebarItem
              icon={FileText}
              label="Purchase Requests"
              to="/purchase-requests"
            />
            <SidebarItem
              icon={CheckCircle}
              label="Approve Requests"
              isActive={true}
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
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Approve Requests Dashboard
              </h2>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statsData.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Pending Requests Table */}
              <div className="lg:col-span-2">
                <Card>
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Pending Approval Requests
                      </h3>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                    </div>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Request ID</TableHead>
                        <TableHead>Requestor</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">
                            {request.id}
                          </TableCell>
                          <TableCell>{request.requester}</TableCell>
                          <TableCell>{request.department}</TableCell>
                          <TableCell>{request.date}</TableCell>
                          <TableCell className="font-medium">
                            {request.amount}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-yellow-100 text-yellow-800 border-0">
                              Pending
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={cn("border-0", request.priorityColor)}
                            >
                              {request.priority}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="p-6 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      Showing 1-10 of 25 requests
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Recent Activity */}
                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Recent Approval Activity
                    </h3>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div
                            className={cn(
                              "w-2 h-2 rounded-full mt-2",
                              activity.type === "approved"
                                ? "bg-green-500"
                                : "bg-red-500",
                            )}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900">
                              <span className="font-medium">
                                {activity.user}
                              </span>{" "}
                              {activity.action}
                            </p>
                            <p className="text-xs text-gray-500">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Department Chart */}
                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Requests by Department
                    </h3>
                    <div className="space-y-3">
                      {departmentData.map((dept, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm text-gray-600">
                            {dept.name}
                          </span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-indigo-600 h-2 rounded-full"
                                style={{
                                  width: `${(dept.value / 8) * 100}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900 w-4">
                              {dept.value}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ApproveRequests;
