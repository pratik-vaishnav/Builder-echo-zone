/**
 * React Utilities for Safe Rendering
 * Prevents "Objects are not valid as a React child" errors
 */

/**
 * Safely renders any value as a string for React components
 * Handles objects, arrays, null, undefined, etc.
 */
export function safeRender(value: any): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  if (typeof value === "object") {
    // Handle arrays
    if (Array.isArray(value)) {
      return value.map((item) => safeRender(item)).join(", ");
    }

    // Handle objects - extract displayable value
    if (value.name) {
      return String(value.name);
    }
    if (value.title) {
      return String(value.title);
    }
    if (value.label) {
      return String(value.label);
    }
    if (value.toString && typeof value.toString === "function") {
      const stringValue = value.toString();
      // Avoid "[object Object]"
      if (stringValue !== "[object Object]") {
        return stringValue;
      }
    }

    // Last resort - JSON stringify (not recommended for rendering)
    try {
      return JSON.stringify(value);
    } catch {
      return "[Object]";
    }
  }

  return String(value);
}

/**
 * Safely extracts a string value from potentially complex data
 */
export function extractStringValue(data: any, fallback: string = ""): string {
  if (!data) return fallback;

  if (typeof data === "string") {
    return data;
  }

  if (typeof data === "object") {
    // Common property names to look for
    const stringProps = [
      "name",
      "title",
      "label",
      "text",
      "value",
      "displayName",
    ];

    for (const prop of stringProps) {
      if (data[prop] && typeof data[prop] === "string") {
        return data[prop];
      }
    }
  }

  return safeRender(data) || fallback;
}

/**
 * Converts department data to string array
 */
export function extractDepartmentNames(departments: any[]): string[] {
  if (!Array.isArray(departments)) {
    return [];
  }

  return departments
    .map((dept) => {
      if (typeof dept === "string") {
        return dept;
      }

      if (typeof dept === "object" && dept !== null) {
        return dept.name || dept.title || dept.department || String(dept);
      }

      return String(dept);
    })
    .filter((name) => name && name.trim().length > 0);
}

/**
 * Debug function to check if a value is safe to render in React
 */
export function isReactSafe(value: any): boolean {
  if (value === null || value === undefined) {
    return true;
  }

  const type = typeof value;

  if (type === "string" || type === "number" || type === "boolean") {
    return true;
  }

  if (type === "object") {
    // React elements are safe
    if (value.$$typeof) {
      return true;
    }

    // Plain objects are not safe
    if (value.constructor === Object || value.constructor === undefined) {
      return false;
    }

    // Arrays are safe if all elements are safe
    if (Array.isArray(value)) {
      return value.every((item) => isReactSafe(item));
    }
  }

  return false;
}

/**
 * Validates and logs potential React rendering issues
 */
export function validateForReact(
  value: any,
  context: string = "unknown",
): void {
  if (!isReactSafe(value)) {
    console.warn(
      `⚠️ Potential React rendering issue in ${context}:`,
      "Value is not safe to render directly:",
      value,
    );
    console.warn(
      "Consider using safeRender() or extractStringValue() to convert to string",
    );
  }
}

/**
 * Processes API response data to ensure React-safe rendering
 */
export function processApiResponse(data: any): any {
  if (Array.isArray(data)) {
    return data.map((item) => processApiResponse(item));
  }

  if (data && typeof data === "object") {
    const processed: any = {};

    for (const [key, value] of Object.entries(data)) {
      if (isReactSafe(value)) {
        processed[key] = value;
      } else if (typeof value === "object" && value !== null) {
        // Convert object to string representation if it has a name property
        if (value.name) {
          processed[key] = value.name;
        } else if (value.title) {
          processed[key] = value.title;
        } else {
          processed[key] = safeRender(value);
        }
      } else {
        processed[key] = safeRender(value);
      }
    }

    return processed;
  }

  return data;
}

export default {
  safeRender,
  extractStringValue,
  extractDepartmentNames,
  isReactSafe,
  validateForReact,
  processApiResponse,
};
