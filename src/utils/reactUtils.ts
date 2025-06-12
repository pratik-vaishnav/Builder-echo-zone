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

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (typeof value === "object") {
    // Handle arrays
    if (Array.isArray(value)) {
      return value.map(item => safeRender(item)).join(", ");
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
    const stringProps = ["name", "title", "label", "text", "value", "displayName"];
    
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

  return departments.map(dept => {
    if (typeof dept === "string") {
      return dept;
    }
    
    if (typeof dept === "object" && dept !== null) {
      return dept.name || dept.title || dept.department || String(dept);
    }
    
    return String(dept);
  }).filter(name => name && name.trim().length > 0);
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
      return value.every(item => isReactSafe(item));
    }
  }

  return false;
}

/**
 * HOC to catch and prevent object rendering errors
 */
export function withSafeRender<T>(Component: React.ComponentType<T>) {
  return function SafeComponent(props: T) {
    try {
      return <Component {...props} />;
    } catch (error) {
      if (error instanceof Error && error.message.includes("Objects are not valid as a React child")) {
        console.error("React rendering error caught:", error);
        console.error("Props that caused the error:", props);
        return <div className="text-red-500 text-sm">Rendering error: Invalid object in component</div>;
      }
      throw error;
    }
  };
}

export default {
  safeRender,
  extractStringValue,
  extractDepartmentNames,
  isReactSafe,
  withSafeRender,
};