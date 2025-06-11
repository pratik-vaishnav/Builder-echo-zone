import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Mail,
  User,
  Phone,
  Building2,
  Package,
  Calendar,
  Printer,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

// Mock data
const statsData = [
  {
    title: "Total Orders",
    value: "7",
    subtitle: "Total",
    icon: ShoppingCart,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Pending Approval",
    value: "2",
    subtitle: "Total",
    icon: Clock,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
  {
    title: "Approved Orders",
    value: "3",
    subtitle: "Total",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Cancelled Orders",
    value: "1",
    subtitle: "Total",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
];

const ordersData = [
  {
    orderNo: "PO-2024-001",
    supplier: "Tech Innovations Inc.",
    status: "Approved",
    orderDate: "2024-07-01",
    amount: "$12500.75",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    orderNo: "PO-2024-002",
    supplier: "Office Supplies Co.",
    status: "Pending",
    orderDate: "2024-07-05",
    amount: "$3200.50",
    statusColor: "bg-yellow-100 text-yellow-800",
  },
  {
    orderNo: "PO-2024-003",
    supplier: "Industrial Solutions Ltd.",
    status: "Completed",
    orderDate: "2024-06-10",
    amount: "$25000.00",
    statusColor: "bg-blue-100 text-blue-800",
  },
  {
    orderNo: "PO-2024-004",
    supplier: "Software Guild",
    status: "Approved",
    orderDate: "2024-07-08",
    amount: "$7500.00",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    orderNo: "PO-2024-005",
    supplier: "Global Logistics",
    status: "Cancelled",
    orderDate: "2024-07-02",
    amount: "$500.00",
    statusColor: "bg-red-100 text-red-800",
  },
  {
    orderNo: "PO-2024-006",
    supplier: "Prime Furniture Solutions",
    status: "Approved",
    orderDate: "2024-07-10",
    amount: "$8900.00",
    statusColor: "bg-green-100 text-green-800",
  },
];

const selectedOrderDetails = {
  orderNo: "PO-2024-001",
  status: "Approved",
  supplier: {
    name: "Tech Innovations Inc.",
    contact: "Alice Wonderland",
    email: "alice@techinnovations.com",
    phone: "+1 (555) 123-4567",
  },
  items: [
    {
      name: "15-inch Laptop Pro",
      quantity: 10,
      price: "$1000.00",
    },
    {
      name: "Ergonomic Keyboard",
      quantity: 20,
      price: "$125.00",
    },
  ],
  totalAmount: "$12500.75",
  timeline: [
    {
      status: "Order Placed",
      date: "2024-07-01",
      person: "John Doe",
      color: "bg-blue-500",
    },
    {
      status: "Approved by Manager",
      date: "2024-07-02",
      person: "Jane Smith",
      color: "bg-green-500",
    },
    {
      status: "Payment Processed",
      date: "2024-07-03",
      person: "Finance Dept",
      color: "bg-purple-500",
    },
    {
      status: "Items Shipped",
      date: "2024-07-10",
      person: "Supplier",
      color: "bg-orange-500",
    },
  ],
};

const SidebarItem = ({
  icon: Icon,
  label,
  isActive = false,
  onClick,
}: {
  icon: any;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors",
      isActive ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-100",
    )}
  >
    <Icon className="h-5 w-5" />
    <span className="font-medium">{label}</span>
  </button>
);

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  bgColor,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: any;
  color: string;
  bgColor: string;
}) => (
  <Card>
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

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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
                to="/dashboard"
                className="text-gray-500 hover:text-gray-700"
              >
                Dashboard
              </Link>
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
              <span className="text-indigo-600 font-medium border-b-2 border-indigo-600 pb-2">
                Purchase Orders
              </span>
            </nav>
          </div>
          <Avatar>
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-indigo-100 text-indigo-600">
              JD
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)]">
          <div className="p-4 space-y-2">
            <SidebarItem icon={Building2} label="Dashboard" to="/dashboard" />
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
              icon={ShoppingCart}
              label="Purchase Orders"
              isActive={true}
            />
          </div>
          <div className="absolute bottom-4 left-4">
            <SidebarItem icon={User} label="User Profile" to="/profile" />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statsData.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>

            {/* Orders Table */}
            <Card>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    All Purchase Orders
                  </h2>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-80"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                      <Plus className="h-4 w-4 mr-2" />
                      New Order
                    </Button>
                  </div>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order No.</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordersData.map((order) => (
                    <TableRow key={order.orderNo}>
                      <TableCell className="font-medium">
                        {order.orderNo}
                      </TableCell>
                      <TableCell>{order.supplier}</TableCell>
                      <TableCell>
                        <Badge className={cn("border-0", order.statusColor)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{order.orderDate}</TableCell>
                      <TableCell className="font-medium">
                        {order.amount}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between p-6 border-t border-gray-200">
                <div className="text-sm text-gray-500">Page 1 of 2</div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </main>

        {/* Right Sidebar - Order Details */}
        <aside className="w-80 bg-white border-l border-gray-200 min-h-[calc(100vh-73px)]">
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Details
              </h3>
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">
                  {selectedOrderDetails.orderNo}
                </span>
                <Badge className="bg-green-100 text-green-800 border-0">
                  {selectedOrderDetails.status}
                </Badge>
              </div>
            </div>

            {/* Supplier Information */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <Building2 className="h-4 w-4 mr-2" />
                Supplier Information
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-indigo-600">
                      TI
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {selectedOrderDetails.supplier.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedOrderDetails.supplier.contact}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 ml-11">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-3 w-3 mr-2" />
                    {selectedOrderDetails.supplier.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-3 w-3 mr-2" />
                    {selectedOrderDetails.supplier.phone}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <Package className="h-4 w-4 mr-2" />
                Order Items
              </h4>
              <div className="space-y-3">
                {selectedOrderDetails.items.map((item, index) => (
                  <div key={index} className="text-sm">
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-gray-500">
                      ({item.quantity} x {item.price})
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">
                    Total Amount:
                  </span>
                  <span className="font-bold text-indigo-600 text-lg">
                    {selectedOrderDetails.totalAmount}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Order Timeline
              </h4>
              <div className="space-y-4">
                {selectedOrderDetails.timeline.map((event, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div
                      className={cn("w-2 h-2 rounded-full mt-2", event.color)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {event.status}
                      </p>
                      <p className="text-xs text-gray-500">
                        {event.date} by {event.person}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                <Printer className="h-4 w-4 mr-2" />
                Print Order
              </Button>
              <Button variant="outline" className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Send Confirmation Email
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Index;
