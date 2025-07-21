/**
 * Truncates a string to a maximum length, adding ellipsis if needed.
 * @param str - String to truncate
 * @param maxLength - Maximum allowed length
 * @returns Truncated string with ellipsis if exceeded
 */
function truncateString(str: string, maxLength: number): string {
  return str.length > maxLength ? `${str.slice(0, maxLength)}...` : str;
}

export default truncateString;
