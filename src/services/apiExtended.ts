/**
 * Extended API Service for additional department analytics
 * Provides detailed department data with budget and spending information
 */

import MockDataService from "./mockData";
import { apiService } from "./api";

class ApiExtendedService {
  /**
   * Get detailed department analytics with budget and spending data
   */
  async getDepartmentAnalytics() {
    try {
      const response = await fetch(
        "http://localhost:8080/api/departments/analytics",
        {
          headers: apiService["getAuthHeaders"](),
          signal: AbortSignal.timeout(5000),
        },
      );

      if (response.ok) {
        return response.json();
      }
      throw new Error("Backend not available");
    } catch (error) {
      console.log("Backend unavailable, using mock department analytics");
      return MockDataService.generateMockDepartments();
    }
  }

  /**
   * Get simple department names list
   */
  async getDepartmentNames() {
    try {
      const analytics = await this.getDepartmentAnalytics();
      return analytics.map((dept) => dept.name);
    } catch (error) {
      console.log("Failed to get department names, using fallback");
      return [
        "IT",
        "HR",
        "Finance",
        "Marketing",
        "Operations",
        "Procurement",
        "Legal",
        "Engineering",
      ];
    }
  }
}

export const apiExtendedService = new ApiExtendedService();
export default apiExtendedService;
