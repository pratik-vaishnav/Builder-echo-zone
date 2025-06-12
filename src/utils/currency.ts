/**
 * Currency Utility Functions for Indian Rupees
 * Handles formatting and display of currency in INR
 */

/**
 * Format number as Indian Rupee currency
 */
export const formatCurrency = (
  amount: number | string | undefined | null,
): string => {
  if (amount === undefined || amount === null || amount === "") {
    return "₹0.00";
  }

  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) {
    return "₹0.00";
  }

  // Format with Indian locale for proper comma placement
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount);
};

/**
 * Format number as compact Indian Rupee (e.g., ₹1.2L, ₹5.5Cr)
 */
export const formatCompactCurrency = (
  amount: number | string | undefined | null,
): string => {
  if (amount === undefined || amount === null || amount === "") {
    return "₹0";
  }

  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) {
    return "₹0";
  }

  // Indian numbering system
  if (numAmount >= 10000000) {
    // 1 Crore
    return `₹${(numAmount / 10000000).toFixed(1)}Cr`;
  } else if (numAmount >= 100000) {
    // 1 Lakh
    return `₹${(numAmount / 100000).toFixed(1)}L`;
  } else if (numAmount >= 1000) {
    // 1 Thousand
    return `₹${(numAmount / 1000).toFixed(1)}K`;
  } else {
    return `₹${numAmount.toFixed(0)}`;
  }
};

/**
 * Parse currency string to number
 */
export const parseCurrency = (currencyString: string): number => {
  if (!currencyString) return 0;

  // Remove currency symbol and commas
  const cleanString = currencyString.replace(/[₹,\s]/g, "");
  const number = parseFloat(cleanString);

  return isNaN(number) ? 0 : number;
};

/**
 * Format currency for form inputs (without symbol for easier editing)
 */
export const formatCurrencyInput = (
  amount: number | string | undefined | null,
): string => {
  if (amount === undefined || amount === null || amount === "") {
    return "";
  }

  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) {
    return "";
  }

  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount);
};

/**
 * Convert amount to words in Indian format
 */
export const amountToWords = (amount: number): string => {
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  const teens = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const convertHundreds = (num: number): string => {
    let result = "";

    if (num >= 100) {
      result += ones[Math.floor(num / 100)] + " Hundred ";
      num %= 100;
    }

    if (num >= 20) {
      result += tens[Math.floor(num / 10)] + " ";
      num %= 10;
    } else if (num >= 10) {
      result += teens[num - 10] + " ";
      return result;
    }

    if (num > 0) {
      result += ones[num] + " ";
    }

    return result;
  };

  if (amount === 0) return "Zero Rupees Only";

  let result = "";

  // Crores
  if (amount >= 10000000) {
    result += convertHundreds(Math.floor(amount / 10000000)) + "Crore ";
    amount %= 10000000;
  }

  // Lakhs
  if (amount >= 100000) {
    result += convertHundreds(Math.floor(amount / 100000)) + "Lakh ";
    amount %= 100000;
  }

  // Thousands
  if (amount >= 1000) {
    result += convertHundreds(Math.floor(amount / 1000)) + "Thousand ";
    amount %= 1000;
  }

  // Remaining hundreds, tens, ones
  if (amount > 0) {
    result += convertHundreds(amount);
  }

  return result.trim() + " Rupees Only";
};

/**
 * Get currency symbol
 */
export const getCurrencySymbol = (): string => "₹";

/**
 * Get currency code
 */
export const getCurrencyCode = (): string => "INR";

/**
 * Validate currency amount
 */
export const isValidCurrency = (amount: string | number): boolean => {
  if (typeof amount === "string") {
    amount = parseCurrency(amount);
  }
  return !isNaN(amount) && amount >= 0;
};

/**
 * Calculate percentage change and format with currency
 */
export const formatCurrencyChange = (
  current: number,
  previous: number,
): {
  amount: string;
  percentage: string;
  isPositive: boolean;
} => {
  const change = current - previous;
  const percentage = previous !== 0 ? (change / previous) * 100 : 0;

  return {
    amount: formatCurrency(Math.abs(change)),
    percentage: `${Math.abs(percentage).toFixed(1)}%`,
    isPositive: change >= 0,
  };
};
