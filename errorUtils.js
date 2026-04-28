/**
 * Error handling utilities for MTAF
 * Provides consistent error logging and safe async operations
 */

/**
 * Safe wrapper for async operations that logs errors instead of silently failing
 * @param {Promise} promise - The async operation
 * @param {string} context - Description of what operation failed (for logging)
 * @param {Function} onError - Optional custom error handler
 */
export async function safeAsync(promise, context, onError = null) {
  try {
    return await promise;
  } catch (error) {
    const message = `[${context}] ${error?.message || 'Unknown error'}`;
    console.warn(message, error);
    if (onError) onError(error);
    return null;
  }
}

/**
 * Safe JSON parsing with error handling
 * @param {string} jsonString - String to parse
 * @param {string} context - Description for error logging
 * @param {any} fallback - Value to return if parsing fails
 */
export function safeJsonParse(jsonString, context, fallback = null) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn(`[${context}] Failed to parse JSON:`, error);
    return fallback;
  }
}

/**
 * Safe JSON stringification
 * @param {any} value - Value to stringify
 * @param {string} context - Description for error logging
 */
export function safeJsonStringify(value, context) {
  try {
    return JSON.stringify(value);
  } catch (error) {
    console.warn(`[${context}] Failed to stringify to JSON:`, error);
    return null;
  }
}

/**
 * Safe property access with optional chaining fallback
 * @param {any} obj - Object to access
 * @param {string} path - Dot-separated property path (e.g., 'user.profile.name')
 * @param {any} fallback - Value if property doesn't exist
 */
export function safeGet(obj, path, fallback = null) {
  try {
    const value = path.split('.').reduce((curr, prop) => curr?.[prop], obj);
    return value ?? fallback;
  } catch (error) {
    return fallback;
  }
}

/**
 * Debounced error logging to avoid console spam
 */
let errorCache = {};

export function logErrorOnce(key, message, error = null) {
  if (!errorCache[key]) {
    console.warn(`[${key}] ${message}`, error);
    errorCache[key] = true;
    setTimeout(() => {
      delete errorCache[key];
    }, 5000);
  }
}
