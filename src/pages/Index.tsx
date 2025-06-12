import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Phone,
  Building2,
  Package,
  Calendar,
  Printer,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Activity,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import Layout from "@/components/shared/Layout";
import webSocketService, { NotificationMessage } from "@/services/websocket";
import { formatCurrency } from "@/utils/currency";

// Order interface
interface Order {
  id: string;
  orderNumber: string;
  supplierName: string;
  supplierEmail: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  expectedDelivery: string;
  department: string;
  requestedBy: string;
  items: number;
}

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());
  const [orders, setOrders] = useState<Order[]>([]);
  const recordsPerPage = 10;

  // Real-time statistics
  const [stats, setStats] = useState({
    totalOrders: 47,
    pendingApproval: 8,
    approved: 23,
    delivered: 16,
  });

  useEffect(() => {
    // Check WebSocket connection
    setIsConnected(webSocketService.isConnectedStatus());

    // Subscribe to purchase order updates
    const unsubscribePO = webSocketService.subscribe(
      "purchase-orders",
      (notification: NotificationMessage) => {
        console.log("📦 Purchase Order update:", notification);
        loadOrders(); // Refresh orders list
        setLastUpdateTime(new Date());
      },
    );

    // Subscribe to general updates that might affect orders
    const unsubscribeUpdates = webSocketService.subscribe(
      "dashboard-updates",
      (notification: NotificationMessage) => {
        if (
          notification.type === "PURCHASE_ORDER_CREATED" ||
          notification.type === "WORKFLOW_UPDATE"
        ) {
          loadOrders();
          setLastUpdateTime(new Date());
        }
      },
    );

    // Load initial data
    loadOrders();

    return () => {
      unsubscribePO();
      unsubscribeUpdates();
    };
  }, []);

  const loadOrders = () => {
    // Mock data with real-time simulation
    const mockOrders: Order[] = [
      {
        id: "1",
        orderNumber: "PO-2024-001",
        supplierName: "Dell Technologies India",
        supplierEmail: "orders@dell.com",
        totalAmount: 245000,
        status: "Confirmed",
        createdAt: "2024-01-15",
        expectedDelivery: "2024-02-01",
        department: "IT",
        requestedBy: "John Doe",
        items: 5,
      },
      {
        id: "2",
        orderNumber: "PO-2024-002",
        supplierName: "Microsoft India",
        supplierEmail: "licenses@microsoft.com",
        totalAmount: 180000,
        status: "In Transit",
        createdAt: "2024-01-18",
        expectedDelivery: "2024-01-25",
        department: "IT",
        requestedBy: "Jane Smith",
        items: 3,
      },
      {
        id: "3",
        orderNumber: "PO-2024-003",
        supplierName: "Godrej Interio",
        supplierEmail: "orders@godrejinterio.com",
        totalAmount: 125000,
        status: "Delivered",
        createdAt: "2024-01-10",
        expectedDelivery: "2024-01-20",
        department: "HR",
        requestedBy: "Mike Johnson",
        items: 8,
      },
      {
        id: "4",
        orderNumber: "PO-2024-004",
        supplierName: "ITC Limited",
        supplierEmail: "procurement@itc.in",
        totalAmount: 35000,
        status: "Pending",
        createdAt: "2024-01-20",
        expectedDelivery: "2024-02-05",
        department: "Admin",
        requestedBy: "Sarah Wilson",
        items: 12,
      },
      {
        id: "5",
        orderNumber: "PO-2024-005",
        supplierName: "TCS Supplier Network",
        supplierEmail: "orders@tcs.com",
        totalAmount: 89000,
        status: "Confirmed",
        createdAt: "2024-01-22",
        expectedDelivery: "2024-02-08",
        department: "Finance",
        requestedBy: "Robert Brown",
        items: 4,
      },
    ];

    setOrders(mockOrders);
  };

  const statsData = [
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      subtitle: "All time",
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Pending Approval",
      value: stats.pendingApproval.toString(),
      subtitle: "Awaiting",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Approved",
      value: stats.approved.toString(),
      subtitle: "Ready to ship",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Delivered",
      value: stats.delivered.toString(),
      subtitle: "Completed",
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Pending: { variant: "outline", color: "text-orange-600" },
      Confirmed: { variant: "default", color: "text-blue-600" },
      "In Transit": { variant: "secondary", color: "text-indigo-600" },
      Delivered: { variant: "default", color: "text-green-600" },
      Cancelled: { variant: "destructive", color: "text-red-600" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      variant: "outline",
      color: "text-gray-600",
    };

    return (
      <Badge variant={config.variant as any} className={config.color}>
        {status}
      </Badge>
    );
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredOrders.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  const totalAmount = filteredOrders.reduce(
    (sum, order) => sum + order.totalAmount,
    0,
  );

  return (
    <Layout currentPage="purchase-orders">
      <div className="min-h-screen p-6 space-y-6">
        {/* Header with Real-time Status */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Purchase Orders
            </h1>
            <p className="text-gray-600 mt-1">
              Real-time order tracking and management
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
                }`}
              ></div>
              <span className="text-sm text-gray-600">
                {isConnected ? "Live Updates" : "Offline"}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Last updated: {lastUpdateTime.toLocaleTimeString()}
            </div>
            <Link to="/submit-request">
              <Button className="btn-gradient">
                <Plus className="h-4 w-4 mr-2" />
                New Order
              </Button>
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <Card
              key={index}
              className="card-modern hover:shadow-xl transition-all duration-300 group"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {stat.subtitle}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                {isConnected && (
                  <div className="flex items-center mt-2">
                    <Activity className="h-3 w-3 text-green-500 animate-pulse mr-1" />
                    <span className="text-xs text-green-600">Live</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <Card className="card-modern">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search orders, suppliers, departments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 input-modern"
                  />
                </div>
                <Button variant="outline" className="whitespace-nowrap">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>
                  {filteredOrders.length} orders • Total Value:{" "}
                  {formatCurrency(totalAmount)}
                </span>
                {isConnected && (
                  <div className="flex items-center space-x-1">
                    <Zap className="h-4 w-4 text-green-500" />
                    <span className="text-green-600">Real-time</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card className="card-modern overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">
                      Order Number
                    </TableHead>
                    <TableHead className="font-semibold">Supplier</TableHead>
                    <TableHead className="font-semibold">Amount</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Department</TableHead>
                    <TableHead className="font-semibold">
                      Expected Delivery
                    </TableHead>
                    <TableHead className="font-semibold">
                      Requested By
                    </TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentOrders.map((order) => (
                    <TableRow
                      key={order.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span>{order.orderNumber}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.supplierName}</p>
                          <p className="text-sm text-gray-500">
                            {order.supplierEmail}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(order.totalAmount)}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{order.department}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>
                            {new Date(
                              order.expectedDelivery,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{order.requestedBy}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Printer className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-6 border-t">
                <p className="text-sm text-gray-600">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, filteredOrders.length)} of{" "}
                  {filteredOrders.length} orders
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Details Sidebar */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
            <div className="bg-white w-full max-w-lg h-full overflow-y-auto">
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Order Details</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedOrder(null)}
                  >
                    <XCircle className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Order Information</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Order Number:</strong>{" "}
                        {selectedOrder.orderNumber}
                      </p>
                      <p>
                        <strong>Amount:</strong>{" "}
                        {formatCurrency(selectedOrder.totalAmount)}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        {getStatusBadge(selectedOrder.status)}
                      </p>
                      <p>
                        <strong>Items:</strong> {selectedOrder.items} items
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Supplier Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <span>{selectedOrder.supplierName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{selectedOrder.supplierEmail}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Delivery Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>
                          Expected:{" "}
                          {new Date(
                            selectedOrder.expectedDelivery,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <p>
                        <strong>Department:</strong> {selectedOrder.department}
                      </p>
                      <p>
                        <strong>Requested By:</strong>{" "}
                        {selectedOrder.requestedBy}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button className="flex-1">
                    <Printer className="h-4 w-4 mr-2" />
                    Print Order
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Supplier
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
