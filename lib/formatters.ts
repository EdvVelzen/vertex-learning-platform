/**
 * Format duration in seconds (or minutes) to human-readable string.
 * Example: 7200 -> "2h 0m", 350 -> "6m", 7169 -> "1h 59m"
 */
export function formatDuration(seconds?: number | null): string {
  if (!seconds || seconds <= 0) return "0m";

  // If value is small (< 100), it might already be in minutes
  const totalSeconds = seconds > 100 ? seconds : seconds * 60;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  return `${Math.max(1, minutes)}m`;
}

/**
 * Format student counts into readable abbreviated strings.
 * Example: 18240 -> "18.2k", 2100 -> "2.1k", 950 -> "950"
 */
export function formatStudentCount(count?: number | null): string {
  if (!count || count <= 0) return "0";
  if (count >= 1000) {
    const formatted = (count / 1000).toFixed(1);
    return `${formatted.endsWith(".0") ? formatted.slice(0, -2) : formatted}k`;
  }
  return count.toLocaleString();
}

/**
 * Format course skill level for clean display.
 * Example: "intermediate" -> "Intermediate", "all-levels" -> "All Levels"
 */
export function formatLevel(level?: string | null): string {
  if (!level) return "All Levels";
  switch (level.toLowerCase()) {
    case "beginner":
      return "Beginner";
    case "intermediate":
      return "Intermediate";
    case "advanced":
      return "Advanced";
    case "all-levels":
    case "all levels":
      return "All Levels";
    default:
      return level.charAt(0).toUpperCase() + level.slice(1);
  }
}
