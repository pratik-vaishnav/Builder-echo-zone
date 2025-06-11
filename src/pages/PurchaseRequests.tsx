import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  FileText,
  MoreHorizontal,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import Layout from "@/components/shared/Layout";

// Expanded mock data for pagination
const generateRequestsData = () => {
  const departments = [
    "Marketing",
    "Design",
    "Engineering",
    "Operations",
    "IT",
    "Sales",
    "HR",
    "Finance",
  ];
  const priorities = ["High", "Medium", "Low"];
  const statuses = ["Approved", "Pending", "In Review", "Rejected"];
  const names = [
    "Alice Johnson",
    "Bob Smith",
    "Charlie Brown",
    "Diana Prince",
    "Eve Adams",
    "Frank Green",
    "Grace Hall",
    "Harry White",
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
  ];

  const requests = [];
  for (let i = 1; i <= 47; i++) {
    const requester = names[Math.floor(Math.random() * names.length)];
    const department =
      departments[Math.floor(Math.random() * departments.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    requests.push({
      id: i.toString(),
      avatar: requester
        .split(" ")
        .map((n) => n[0])
        .join(""),
      requester,
      date: new Date(2024, 2, Math.floor(Math.random() * 28) + 1)
        .toISOString()
        .split("T")[0],
      amount: `$${(Math.random() * 15000 + 100).toFixed(2)}`,
      department,
      priority,
      description: `Request for ${department.toLowerCase()} department needs - priority ${priority.toLowerCase()}`,
      status,
      statusColor:
        status === "Approved"
          ? "bg-green-100 text-green-800"
          : status === "Pending"
            ? "bg-yellow-100 text-yellow-800"
            : status === "In Review"
              ? "bg-blue-100 text-blue-800"
              : "bg-red-100 text-red-800",
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

const PurchaseRequests = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all-statuses");
  const [departmentFilter, setDepartmentFilter] = useState("all-departments");
  const [priorityFilter, setPriorityFilter] = useState("all-priorities");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const allRequests = generateRequestsData();

  // Filter data
  const filteredRequests = allRequests.filter((request) => {
    const matchesSearch =
      request.requester.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all-statuses" ||
      request.status.toLowerCase().replace(" ", "-") === statusFilter;
    const matchesDepartment =
      departmentFilter === "all-departments" ||
      request.department.toLowerCase() === departmentFilter;
    const matchesPriority =
      priorityFilter === "all-priorities" ||
      request.priority.toLowerCase() === priorityFilter;

    return (
      matchesSearch && matchesStatus && matchesDepartment && matchesPriority
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequests = filteredRequests.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all-statuses");
    setDepartmentFilter("all-departments");
    setPriorityFilter("all-priorities");
    setCurrentPage(1);
  };

  return (
    <Layout currentPage="purchase-requests">
      <div className="page-container">
        {/* Header with icon and title */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Purchase Requests
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and track all requests in ProcureFlow (
              {filteredRequests.length} total)
            </p>
          </div>
          <div className="flex-1 flex justify-end space-x-3">
            <Button variant="outline" className="shadow-sm">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Link to="/submit-request">
              <Button className="btn-gradient shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Create New Request
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6 card-shadow">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-80">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-statuses">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="in-review">In Review</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={departmentFilter}
                onValueChange={setDepartmentFilter}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-departments">
                    All Departments
                  </SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="it">IT</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-priorities">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Requests Table */}
        <Card className="card-shadow">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Requester</TableHead>
                  <TableHead className="w-[120px]">Date</TableHead>
                  <TableHead className="w-[120px]">Amount</TableHead>
                  <TableHead className="w-[140px]">Department</TableHead>
                  <TableHead className="w-[100px]">Priority</TableHead>
                  <TableHead className="min-w-[300px]">Description</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRequests.length > 0 ? (
                  currentRequests.map((request) => (
                    <TableRow key={request.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xs font-semibold">
                              {request.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="font-medium text-gray-900">
                            {request.requester}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {request.date}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {request.amount}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-gray-50">
                          {request.department}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn("border-0", request.priorityColor)}
                        >
                          {request.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm text-gray-600 truncate">
                          {request.description}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("border-0", request.statusColor)}>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            alert(`Action for request ${request.id}`)
                          }
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="text-gray-500">
                        <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No requests found matching your filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Enhanced Pagination */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>
                Showing {Math.min(startIndex + 1, filteredRequests.length)} to{" "}
                {Math.min(endIndex, filteredRequests.length)} of{" "}
                {filteredRequests.length} results
              </span>
              {(searchTerm ||
                statusFilter !== "all-statuses" ||
                departmentFilter !== "all-departments" ||
                priorityFilter !== "all-priorities") && (
                <span className="text-indigo-600 font-medium">
                  (filtered from {allRequests.length} total)
                </span>
              )}
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
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
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
                  })}
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
    </Layout>
  );
};

export default PurchaseRequests;
