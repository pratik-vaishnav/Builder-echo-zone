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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import Layout from "@/components/shared/Layout";

// Mock data
const requestsData = [
  {
    id: "1",
    avatar: "AJ",
    requester: "Alice Johnson",
    date: "2024-03-15",
    amount: "$1200.00",
    department: "Marketing",
    priority: "High",
    description:
      "Request for new office chairs for the marketing department to improve ergonomics.",
    status: "Approved",
    statusColor: "bg-green-100 text-green-800",
    priorityColor: "bg-red-100 text-red-800",
  },
  {
    id: "2",
    avatar: "BS",
    requester: "Bob Smith",
    date: "2024-03-18",
    amount: "$850.00",
    department: "Design",
    priority: "High",
    description:
      "Purchase request for subscription renewal of Adobe Creative Cloud for design team.",
    status: "Pending",
    statusColor: "bg-yellow-100 text-yellow-800",
    priorityColor: "bg-red-100 text-red-800",
  },
  {
    id: "3",
    avatar: "CB",
    requester: "Charlie Brown",
    date: "2024-03-20",
    amount: "$15000.00",
    department: "Engineering",
    priority: "High",
    description:
      "Request for new server hardware for database expansion project.",
    status: "In Review",
    statusColor: "bg-blue-100 text-blue-800",
    priorityColor: "bg-red-100 text-red-800",
  },
  {
    id: "4",
    avatar: "DP",
    requester: "Diana Prince",
    date: "2024-03-21",
    amount: "$300.00",
    department: "Operations",
    priority: "Medium",
    description:
      "Office supplies replenishment: paper, pens, toner cartridges.",
    status: "Approved",
    statusColor: "bg-green-100 text-green-800",
    priorityColor: "bg-orange-100 text-orange-800",
  },
  {
    id: "5",
    avatar: "EA",
    requester: "Eve Adams",
    date: "2024-03-22",
    amount: "$2500.00",
    department: "IT",
    priority: "High",
    description:
      "Request for new software licenses for project management tool (Jira).",
    status: "Rejected",
    statusColor: "bg-red-100 text-red-800",
    priorityColor: "bg-red-100 text-red-800",
  },
  {
    id: "6",
    avatar: "FG",
    requester: "Frank Green",
    date: "2024-03-25",
    amount: "$1800.00",
    department: "Sales",
    priority: "Medium",
    description: "Travel expenses for sales conference in New York.",
    status: "Pending",
    statusColor: "bg-yellow-100 text-yellow-800",
    priorityColor: "bg-orange-100 text-orange-800",
  },
  {
    id: "7",
    avatar: "GH",
    requester: "Grace Hall",
    date: "2024-03-26",
    amount: "$500.00",
    department: "HR",
    priority: "Low",
    description: "New coffee machine for break room.",
    status: "Approved",
    statusColor: "bg-green-100 text-green-800",
    priorityColor: "bg-blue-100 text-blue-800",
  },
  {
    id: "8",
    avatar: "HW",
    requester: "Harry White",
    date: "2024-03-28",
    amount: "$7500.00",
    department: "Finance",
    priority: "High",
    description:
      "Request for external consulting services for Q2 financial audit.",
    status: "In Review",
    statusColor: "bg-blue-100 text-blue-800",
    priorityColor: "bg-red-100 text-red-800",
  },
];

const PurchaseRequests = () => {
  const [searchTerm, setSearchTerm] = useState("");

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
              Manage and track all requests in ProcureFlow
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
              <Select defaultValue="all-statuses">
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
              <Select defaultValue="all-departments">
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
              <Select defaultValue="all-priorities">
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
              <Button variant="outline">Clear Filters</Button>
            </div>
          </CardContent>
        </Card>

        {/* Requests Table */}
        <Card className="card-shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Requester</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requestsData.map((request) => (
                <TableRow key={request.id}>
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
                    <Badge className={cn("border-0", request.priorityColor)}>
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
                      onClick={() => alert("More options menu would open here")}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing 1-{requestsData.length} of {requestsData.length} requests
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-indigo-600 text-white border-indigo-600"
              >
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default PurchaseRequests;
