/**
 * API Service for Real Backend Integration
 * Centralized API calls to Spring Boot backend with fallback to mock data
 */

import MockDataService from "./mockData";

const API_BASE_URL = "http://localhost:8080/api";

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
      );
    }
    return response.json();
  }

  // Authentication APIs
  async login(credentials: { usernameOrEmail: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return this.handleResponse(response);
  }

  async signup(userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    department?: string;
    position?: string;
    phone?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  // Purchase Requests APIs
  async getPurchaseRequests(
    params: {
      page?: number;
      size?: number;
      sortBy?: string;
      sortDir?: string;
      status?: string;
      department?: string;
      priority?: string;
      search?: string;
    } = {},
  ) {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(
        `${API_BASE_URL}/purchase-requests?${queryParams}`,
        {
          headers: this.getAuthHeaders(),
          signal: AbortSignal.timeout(5000),
        },
      );
      return this.handleResponse(response);
    } catch (error) {
      console.log("Backend unavailable, using mock purchase requests data");
      const mockRequests = MockDataService.generateMockPurchaseRequests(
        params.size || 10,
      );
      return {
        content: mockRequests,
        totalElements: 147,
        totalPages: Math.ceil(147 / (params.size || 10)),
        size: params.size || 10,
        number: params.page || 0,
      };
    }
  }

  async getPurchaseRequestById(id: number) {
    const response = await fetch(`${API_BASE_URL}/purchase-requests/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async createPurchaseRequest(requestData: any) {
    const response = await fetch(`${API_BASE_URL}/purchase-requests`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(requestData),
    });
    return this.handleResponse(response);
  }

  async updatePurchaseRequest(id: number, requestData: any) {
    const response = await fetch(`${API_BASE_URL}/purchase-requests/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(requestData),
    });
    return this.handleResponse(response);
  }

  async updateRequestStatus(id: number, status: string) {
    const response = await fetch(
      `${API_BASE_URL}/purchase-requests/${id}/status?status=${status}`,
      {
        method: "PUT",
        headers: this.getAuthHeaders(),
      },
    );
    return this.handleResponse(response);
  }

  async assignRequest(id: number, assigneeId: number) {
    const response = await fetch(
      `${API_BASE_URL}/purchase-requests/${id}/assign?assigneeId=${assigneeId}`,
      {
        method: "PUT",
        headers: this.getAuthHeaders(),
      },
    );
    return this.handleResponse(response);
  }

  async getPendingApprovals(limit: number = 20) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/purchase-requests/pending-approval?limit=${limit}`,
        {
          headers: this.getAuthHeaders(),
          signal: AbortSignal.timeout(5000),
        },
      );
      return this.handleResponse(response);
    } catch (error) {
      console.log("Backend unavailable, using mock pending approvals data");
      const mockRequests = MockDataService.generateMockPurchaseRequests(limit);
      return mockRequests.filter(
        (req) =>
          req.status === "PENDING_APPROVAL" || req.status === "UNDER_REVIEW",
      );
    }
  }

  async getStatistics() {
    try {
      const response = await fetch(
        `${API_BASE_URL}/purchase-requests/statistics`,
        {
          headers: this.getAuthHeaders(),
          signal: AbortSignal.timeout(5000),
        },
      );
      return this.handleResponse(response);
    } catch (error) {
      console.log("Backend unavailable, using mock statistics data");
      return MockDataService.generateMockStatistics();
    }
  }

  async getDepartments() {
    try {
      const response = await fetch(
        `${API_BASE_URL}/purchase-requests/departments`,
        {
          headers: this.getAuthHeaders(),
          signal: AbortSignal.timeout(5000),
        },
      );
      return this.handleResponse(response);
    } catch (error) {
      console.log("Backend unavailable, using mock departments data");
      // Return just department names for consistency with expected format
      const mockDepartments = MockDataService.generateMockDepartments();
      return mockDepartments.map((dept) => dept.name);
    }
  }

  async getMyRequests(
    params: {
      page?: number;
      size?: number;
      sortBy?: string;
      sortDir?: string;
    } = {},
  ) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(
      `${API_BASE_URL}/purchase-requests/my-requests?${queryParams}`,
      {
        headers: this.getAuthHeaders(),
      },
    );
    return this.handleResponse(response);
  }

  // Purchase Orders APIs
  async getPurchaseOrders(
    params: {
      page?: number;
      size?: number;
      sortBy?: string;
      sortDir?: string;
      search?: string;
    } = {},
  ) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(
      `${API_BASE_URL}/purchase-orders?${queryParams}`,
      {
        headers: this.getAuthHeaders(),
      },
    );
    return this.handleResponse(response);
  }

  async getPurchaseOrderById(id: number) {
    const response = await fetch(`${API_BASE_URL}/purchase-orders/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Users APIs
  async getUsers() {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getUserProfile() {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async updateUserProfile(userData: any) {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  // Health check
  async checkHealth() {
    try {
      const response = await fetch("http://localhost:8080/actuator/health", {
        method: "GET",
        signal: AbortSignal.timeout(3000),
      });
      return response.ok;
    } catch (error) {
      console.log("Backend health check failed:", error.message);
      return false;
    }
  }
}

export const apiService = new ApiService();
export default apiService;
