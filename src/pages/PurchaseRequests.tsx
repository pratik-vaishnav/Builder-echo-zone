import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Clock,
  Calendar,
  User,
  Building2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/shared/Layout";
import { formatCurrency } from "@/utils/currency";
import { apiService } from "@/services/api";

interface PurchaseRequest {
  id: number;
  title: string;
  department: string;
  priority: string;
  status: string;
  totalAmount: number;
  requestedByName: string;
  requestedByEmail: string;
  createdAt: string;
  requestNumber: string;
}

const PurchaseRequests = () => {
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [departments, setDepartments] = useState<string[]>([]);
  const recordsPerPage = 10;

  useEffect(() => {
    loadRequests();
    loadDepartments();
  }, [currentPage, searchTerm, statusFilter, departmentFilter, priorityFilter]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        size: recordsPerPage,
        sortBy: "createdAt",
        sortDir: "desc",
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(departmentFilter !== "all" && { department: departmentFilter }),
        ...(priorityFilter !== "all" && { priority: priorityFilter }),
      };

      const response = await apiService.getPurchaseRequests(params);
      setRequests(response.content || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
    } catch (error) {
      console.error("Failed to load purchase requests:", error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      const depts = await apiService.getDepartments();
      // Extract department names from the objects returned by the API
      const departmentNames =
        Array.isArray(depts) && depts.length > 0 && typeof depts[0] === "object"
          ? depts.map((dept) => dept.name)
          : depts;
      setDepartments(departmentNames);
    } catch (error) {
      console.error("Failed to load departments:", error);
      setDepartments(["IT", "HR", "Finance", "Marketing", "Operations"]);
    }
  };

  const handleRefresh = () => {
    loadRequests();
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(0);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(0);
  };

  const handleDepartmentFilter = (value: string) => {
    setDepartmentFilter(value);
    setCurrentPage(0);
  };

  const handlePriorityFilter = (value: string) => {
    setPriorityFilter(value);
    setCurrentPage(0);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { variant: "outline" as const, color: "text-orange-600" },
      UNDER_REVIEW: { variant: "secondary" as const, color: "text-blue-600" },
      APPROVED: { variant: "default" as const, color: "text-green-600" },
      REJECTED: { variant: "destructive" as const, color: "text-red-600" },
      IN_PROGRESS: { variant: "default" as const, color: "text-purple-600" },
      COMPLETED: { variant: "default" as const, color: "text-green-700" },
      CANCELLED: { variant: "outline" as const, color: "text-gray-600" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      variant: "outline" as const,
      color: "text-gray-600",
    };

    return (
      <Badge variant={config.variant} className={config.color}>
        {status.replace("_", " ")}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      URGENT: { color: "bg-red-100 text-red-800" },
      HIGH: { color: "bg-orange-100 text-orange-800" },
      MEDIUM: { color: "bg-yellow-100 text-yellow-800" },
      LOW: { color: "bg-green-100 text-green-800" },
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig] || {
      color: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {priority}
      </span>
    );
  };

  const totalAmount = requests.reduce((sum, req) => sum + req.totalAmount, 0);

  return (
    <Layout currentPage="purchase-requests">
      <div className="min-h-screen p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Purchase Requests
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and track all purchase requests
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Link to="/submit-request">
              <Button className="btn-gradient">
                <Plus className="h-4 w-4 mr-2" />
                Create New Request
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="card-modern">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search requests, titles, departments..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 input-modern"
                  />
                </div>
              </div>

              <Select value={statusFilter} onValueChange={handleStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={departmentFilter}
                onValueChange={handleDepartmentFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem
                      key={typeof dept === "string" ? dept : dept.name}
                      value={typeof dept === "string" ? dept : dept.name}
                    >
                      {typeof dept === "string" ? dept : dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={priorityFilter}
                onValueChange={handlePriorityFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="text-sm text-gray-600">
                Showing {requests.length} of {totalElements} requests
              </div>
              <div className="text-sm font-medium text-gray-900">
                Total Value: {formatCurrency(totalAmount)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requests Table */}
        <Card className="card-modern overflow-hidden">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
                <p className="text-gray-500">Loading purchase requests...</p>
              </div>
            ) : requests.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Purchase Requests Found
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Get started by creating your first purchase request"}
                </p>
                <Link to="/submit-request">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Request
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">
                        Request Number
                      </TableHead>
                      <TableHead className="font-semibold">Title</TableHead>
                      <TableHead className="font-semibold">
                        Department
                      </TableHead>
                      <TableHead className="font-semibold">Priority</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Amount</TableHead>
                      <TableHead className="font-semibold">
                        Requested By
                      </TableHead>
                      <TableHead className="font-semibold">
                        Created Date
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow
                        key={request.id}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span>{request.requestNumber}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="font-medium truncate">
                              {request.title}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            <span>{request.department}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getPriorityBadge(request.priority)}
                        </TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(request.totalAmount)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="font-medium">
                                {request.requestedByName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {request.requestedByEmail}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>
                              {new Date(request.createdAt).toLocaleDateString(
                                "en-IN",
                              )}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-6 border-t">
                <p className="text-sm text-gray-600">
                  Showing {currentPage * recordsPerPage + 1} to{" "}
                  {Math.min((currentPage + 1) * recordsPerPage, totalElements)}{" "}
                  of {totalElements} requests
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(0)}
                    disabled={currentPage === 0}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages - 1)}
                    disabled={currentPage >= totalPages - 1}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PurchaseRequests;
