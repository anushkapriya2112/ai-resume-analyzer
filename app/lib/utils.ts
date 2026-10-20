const BYTE_UNITS = ["B", "KB", "MB", "GB", "TB"] as const;

/**
 * Converts a size in bytes into a human-readable string (e.g. "2 MB").
 *
 * Uses binary prefixes (1 KB = 1024 bytes) and up to 2 decimal places,
 * trimming trailing zeros (e.g. 1536 -> "1.5 KB", 1024 -> "1 KB").
 *
 * @param bytes - The size in bytes. Non-finite values return "0 B".
 * @returns A human-readable size string such as "512 B", "20 MB" or "1.5 GB".
 */
export const formatBytes = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B";
  }

  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    BYTE_UNITS.length - 1
  );
  const value = bytes / 1024 ** exponent;

  // Round to 2 decimals, then drop trailing zeros (1.50 -> 1.5, 20.00 -> 20).
  return `${parseFloat(value.toFixed(2))} ${BYTE_UNITS[exponent]}`;
};

export const generateUUID = () => crypto.randomUUID();
