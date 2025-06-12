/**
 * Mock Data Service for Development
 * Provides realistic Indian business data when backend is unavailable
 */

export interface MockPurchaseRequest {
  id: number;
  requestNumber: string;
  title: string;
  description: string;
  department: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status:
    | "DRAFT"
    | "PENDING_APPROVAL"
    | "UNDER_REVIEW"
    | "APPROVED"
    | "REJECTED"
    | "IN_PROGRESS"
    | "COMPLETED";
  requestedBy: string;
  totalAmount: number;
  requestDate: string;
  urgentProcessing: boolean;
  items?: Array<{
    id: number;
    name: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
}

export interface MockStatistics {
  totalRequests: number;
  pendingRequests: number;
  underReviewRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  inProgressRequests: number;
  completedRequests: number;
  totalSpent: number;
  pendingAmount: number;
  approvedAmount: number;
  inProgressAmount: number;
  requestsThisWeek: number;
  requestsThisMonth: number;
  lastUpdated: string;
}

class MockDataService {
  private static departments = [
    "Operations",
    "IT",
    "Marketing",
    "Finance",
    "HR",
    "Sales",
    "Procurement",
    "Engineering",
    "Quality",
    "Legal",
  ];

  private static indianNames = [
    "Rajesh Kumar",
    "Priya Sharma",
    "Arjun Patel",
    "Sneha Gupta",
    "Vikram Singh",
    "Anita Mehta",
    "Rohit Agarwal",
    "Kavya Reddy",
    "Amit Joshi",
    "Neha Shah",
    "Sanjay Verma",
    "Deepika Iyer",
    "Rahul Nair",
    "Pooja Mishra",
    "Karthik Raman",
    "Divya Jain",
  ];

  private static requestTitles = [
    "Office Furniture Procurement",
    "Software Licenses Renewal",
    "Marketing Materials",
    "Computer Hardware Purchase",
    "Facility Maintenance Supplies",
    "Training Program Materials",
    "Security Equipment",
    "Office Stationery Bulk Order",
    "Vehicle Maintenance",
    "Catering Services Contract",
    "Legal Documentation Services",
    "IT Infrastructure Upgrade",
    "Building Renovation Supplies",
    "Medical Insurance Renewal",
    "Event Management Services",
  ];

  static generateMockStatistics(): MockStatistics {
    // Generate realistic numbers that add up correctly
    const totalRequests = 147;
    const completedRequests = 89;
    const rejectedRequests = 12;
    const activeRequests = totalRequests - completedRequests - rejectedRequests;

    const pendingRequests = Math.floor(activeRequests * 0.3);
    const underReviewRequests = Math.floor(activeRequests * 0.2);
    const approvedRequests = Math.floor(activeRequests * 0.35);
    const inProgressRequests =
      activeRequests - pendingRequests - underReviewRequests - approvedRequests;

    return {
      totalRequests,
      pendingRequests,
      underReviewRequests,
      approvedRequests,
      rejectedRequests,
      inProgressRequests,
      completedRequests,
      totalSpent: 18475000, // ₹1.84 crore
      pendingAmount: 567800, // ₹5.67 lakh
      approvedAmount: 1456200, // ₹14.56 lakh
      inProgressAmount: 878900, // ₹8.78 lakh
      requestsThisWeek: 8,
      requestsThisMonth: 23,
      lastUpdated: new Date().toISOString(),
    };
  }

  static generateMockPurchaseRequests(
    count: number = 20,
  ): MockPurchaseRequest[] {
    const requests: MockPurchaseRequest[] = [];
    const statuses: MockPurchaseRequest["status"][] = [
      "PENDING_APPROVAL",
      "UNDER_REVIEW",
      "APPROVED",
      "IN_PROGRESS",
      "COMPLETED",
      "REJECTED",
    ];
    const priorities: MockPurchaseRequest["priority"][] = [
      "LOW",
      "MEDIUM",
      "HIGH",
      "URGENT",
    ];

    for (let i = 1; i <= count; i++) {
      const requestDate = new Date();
      requestDate.setDate(
        requestDate.getDate() - Math.floor(Math.random() * 30),
      );

      const department =
        this.departments[Math.floor(Math.random() * this.departments.length)];
      const title =
        this.requestTitles[
          Math.floor(Math.random() * this.requestTitles.length)
        ];
      const requestedBy =
        this.indianNames[Math.floor(Math.random() * this.indianNames.length)];
      const priority =
        priorities[Math.floor(Math.random() * priorities.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      // Generate realistic Indian amounts
      const baseAmount = Math.floor(Math.random() * 500000) + 25000; // ₹25K to ₹5L
      const totalAmount = Math.ceil(baseAmount / 1000) * 1000; // Round to nearest 1000

      requests.push({
        id: i,
        requestNumber: `PR-2024-${String(i).padStart(3, "0")}`,
        title: `${title} - ${department}`,
        description: this.generateDescription(title, department),
        department,
        priority,
        status,
        requestedBy,
        totalAmount,
        requestDate: requestDate.toISOString(),
        urgentProcessing: priority === "URGENT" || Math.random() < 0.1,
        items: this.generateMockItems(title),
      });
    }

    return requests.sort(
      (a, b) =>
        new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime(),
    );
  }

  private static generateDescription(
    title: string,
    department: string,
  ): string {
    const descriptions = {
      "Office Furniture Procurement":
        "Ergonomic chairs, standing desks, and workstations for enhanced productivity",
      "Software Licenses Renewal":
        "Annual license renewal for essential business software and development tools",
      "Marketing Materials":
        "Promotional banners, brochures, and digital marketing assets for campaigns",
      "Computer Hardware Purchase":
        "Laptops, desktops, monitors, and peripherals for team expansion",
      "Facility Maintenance Supplies":
        "Cleaning supplies, maintenance tools, and facility upkeep materials",
      "Training Program Materials":
        "Educational resources, certification programs, and skill development materials",
      "Security Equipment":
        "CCTV systems, access control devices, and security monitoring equipment",
      "Office Stationery Bulk Order":
        "Paper, pens, folders, and essential office supplies for quarterly needs",
      "Vehicle Maintenance":
        "Fleet maintenance, fuel costs, and vehicle servicing for company vehicles",
      "Catering Services Contract":
        "Office cafeteria services, team events, and corporate meeting catering",
    };

    return (
      descriptions[title as keyof typeof descriptions] ||
      `${title} requirements for ${department} department operations and workflow enhancement`
    );
  }

  private static generateMockItems(title: string): Array<{
    id: number;
    name: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }> {
    const itemSets = {
      "Office Furniture Procurement": [
        {
          name: "Ergonomic Office Chair",
          description: "Mesh back with lumbar support",
          quantity: 10,
          unitPrice: 8500,
        },
        {
          name: "Standing Desk",
          description: "Height adjustable electric desk",
          quantity: 5,
          unitPrice: 15000,
        },
        {
          name: "Monitor Stand",
          description: "Dual monitor adjustable stand",
          quantity: 8,
          unitPrice: 2500,
        },
      ],
      "Software Licenses Renewal": [
        {
          name: "Microsoft Office 365",
          description: "Business Premium license",
          quantity: 50,
          unitPrice: 2400,
        },
        {
          name: "Adobe Creative Suite",
          description: "Annual team license",
          quantity: 10,
          unitPrice: 12000,
        },
        {
          name: "Project Management Tool",
          description: "Team collaboration software",
          quantity: 100,
          unitPrice: 800,
        },
      ],
      "Computer Hardware Purchase": [
        {
          name: "Dell Laptop",
          description: "i5 processor, 8GB RAM, 256GB SSD",
          quantity: 5,
          unitPrice: 45000,
        },
        {
          name: '24" Monitor',
          description: "1080p IPS display",
          quantity: 10,
          unitPrice: 12000,
        },
        {
          name: "Wireless Mouse",
          description: "Ergonomic design with USB receiver",
          quantity: 15,
          unitPrice: 800,
        },
      ],
    };

    const defaultItems = [
      {
        name: "Standard Item",
        description: "General procurement item",
        quantity: 1,
        unitPrice: 50000,
      },
    ];

    const items = itemSets[title as keyof typeof itemSets] || defaultItems;

    return items.map((item, index) => ({
      id: index + 1,
      ...item,
      totalPrice: item.quantity * item.unitPrice,
    }));
  }

  static generateMockUsers() {
    return this.indianNames.map((name, index) => ({
      id: index + 1,
      name,
      email: `${name.toLowerCase().replace(" ", ".")}@company.com`,
      department: this.departments[index % this.departments.length],
      position:
        index % 3 === 0
          ? "Manager"
          : index % 3 === 1
            ? "Senior Executive"
            : "Executive",
      phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    }));
  }

  static generateMockDepartments() {
    return this.departments.map((dept) => ({
      name: dept,
      budget: Math.floor(Math.random() * 50000000) + 10000000, // ₹1Cr to ₹5Cr
      spent: Math.floor(Math.random() * 30000000) + 5000000, // ₹50L to ₹3Cr
      requestCount: Math.floor(Math.random() * 50) + 5,
    }));
  }

  // Real-time simulation
  static simulateRealTimeUpdate(): {
    type: string;
    data: any;
    timestamp: string;
  } {
    const updateTypes = [
      "PURCHASE_REQUEST_CREATED",
      "PURCHASE_REQUEST_APPROVED",
      "PURCHASE_REQUEST_REJECTED",
      "PURCHASE_ORDER_GENERATED",
      "STATISTICS_UPDATE",
    ];

    const type = updateTypes[Math.floor(Math.random() * updateTypes.length)];
    const timestamp = new Date().toISOString();

    switch (type) {
      case "STATISTICS_UPDATE":
        return {
          type,
          data: this.generateMockStatistics(),
          timestamp,
        };

      case "PURCHASE_REQUEST_CREATED":
        const newRequest = this.generateMockPurchaseRequests(1)[0];
        return {
          type,
          data: {
            title: "New Purchase Request",
            message: `${newRequest.requestedBy} submitted "${newRequest.title}"`,
            requestNumber: newRequest.requestNumber,
            amount: newRequest.totalAmount,
          },
          timestamp,
        };

      default:
        return {
          type,
          data: {
            title: "System Update",
            message: "Procurement workflow update",
          },
          timestamp,
        };
    }
  }
}

export default MockDataService;
