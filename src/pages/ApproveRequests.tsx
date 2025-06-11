import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Filter,
  Clock,
  AlertTriangle,
  FileText,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Layout from "@/components/shared/Layout";

// Expanded mock data for pagination
const generatePendingRequests = () => {
  const departments = [
    "Marketing",
    "Sales",
    "HR",
    "IT",
    "Operations",
    "Finance",
    "Engineering",
    "Design",
  ];
  const priorities = ["High", "Medium", "Low"];
  const names = [
    "Alice Johnson",
    "Bob Williams",
    "Charlie Green",
    "Diana Prince",
    "Eve Adams",
    "Frank White",
    "Grace Hall",
    "Henry King",
    "Ivy Queen",
    "Jack Black",
    "Kate Wilson",
    "Liam Davis",
    "Mia Taylor",
    "Noah Brown",
    "Olivia Jones",
    "Paul Miller",
    "Quinn Garcia",
    "Ruby Lee",
    "Sam Wilson",
    "Tina Moore",
    "Uma Patel",
    "Victor Chang",
    "Wendy Clark",
    "Xavier Lopez",
    "Yara Hassan",
  ];

  const requests = [];
  for (let i = 1; i <= 35; i++) {
    const requester = names[Math.floor(Math.random() * names.length)];
    const department =
      departments[Math.floor(Math.random() * departments.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];

    requests.push({
      id: `PR-${String(i).padStart(3, "0")}`,
      requester,
      department,
      date: new Date(2024, 6, Math.floor(Math.random() * 30) + 1)
        .toISOString()
        .split("T")[0],
      amount: `$${(Math.random() * 10000 + 100).toFixed(2)}`,
      priority,
      priorityColor:
        priority === "High"
          ? "bg-red-100 text-red-800"
          : priority === "Medium"
            ? "bg-orange-100 text-orange-800"
            : "bg-blue-100 text-blue-800",
    });
  }
  return requests;
};

// Mock data
const statsData = [
  {
    title: "Pending Approvals",
    value: "35",
    subtitle: "Requests awaiting your review",
    icon: Clock,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
  {
    title: "High Priority",
    value: "12",
    subtitle: "Urgent requests pending",
    icon: AlertTriangle,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
  {
    title: "Overdue Requests",
    value: "3",
    subtitle: "Past due date",
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    title: "Recently Approved",
    value: "18",
    subtitle: "Approved in the last 24 hours",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
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
  <Card className={cn("border-l-4 card-shadow", borderColor)}>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className={cn("p-3 rounded-xl", bgColor)}>
          <Icon className={cn("h-6 w-6", color)} />
        </div>
      </div>
    </CardContent>
  </Card>
);

const ApproveRequests = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const allRequests = generatePendingRequests();
  const totalPages = Math.ceil(allRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequests = allRequests.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <Layout currentPage="approve-requests">
      <div className="page-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Approve Requests Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Review and approve requests in your ProcureFlow pipeline (
            {allRequests.length} pending)
          </p>
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
            <Card className="card-shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Pending Approval Requests
                  </h2>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Request ID</TableHead>
                      <TableHead className="w-[160px]">Requestor</TableHead>
                      <TableHead className="w-[140px]">Department</TableHead>
                      <TableHead className="w-[120px]">Date</TableHead>
                      <TableHead className="w-[120px]">Amount</TableHead>
                      <TableHead className="w-[100px]">Status</TableHead>
                      <TableHead className="w-[100px]">Priority</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentRequests.map((request) => (
                      <TableRow key={request.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          {request.id}
                        </TableCell>
                        <TableCell>{request.requester}</TableCell>
                        <TableCell>{request.department}</TableCell>
                        <TableCell>{request.date}</TableCell>
                        <TableCell className="font-semibold">
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
              </div>

              {/* Enhanced Pagination */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, allRequests.length)} of{" "}
                  {allRequests.length} requests
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {/* Page Numbers */}
                    <div className="flex space-x-1">
                      {Array.from(
                        { length: Math.min(3, totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage <= 2) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 1) {
                            pageNum = totalPages - 2 + i;
                          } else {
                            pageNum = currentPage - 1 + i;
                          }

                          return (
                            <Button
                              key={pageNum}
                              variant="outline"
                              size="sm"
                              onClick={() => goToPage(pageNum)}
                              className={
                                currentPage === pageNum
                                  ? "bg-indigo-600 text-white border-indigo-600"
                                  : ""
                              }
                            >
                              {pageNum}
                            </Button>
                          );
                        },
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(totalPages)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card className="card-shadow">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Approval Activity
                </h3>
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                          activity.type === "approved"
                            ? "bg-green-500"
                            : "bg-red-500",
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{activity.user}</span>{" "}
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Department Chart */}
            <Card className="card-shadow">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Requests by Department
                </h3>
                <div className="space-y-3">
                  {departmentData.map((dept, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-600">{dept.name}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full"
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ApproveRequests;
