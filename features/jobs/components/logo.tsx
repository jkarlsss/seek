import { createAvatar } from "@dicebear/core";
import { initials } from "@dicebear/collection";
import { cn } from "../../../lib/utils";

/**
 * Get initials from a string
 * Example:
 * "Jan Karlo" -> "JK"
 * "archcode" -> "A"
 */
export function getInitials(name: string, limit = 2) {
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, limit)
    .toUpperCase();
}

/**
 * Generate DiceBear SVG
 */
export function generateAvatar(name: string) {
  const avatar = createAvatar(initials, {
    seed: name,

    // initials
    chars: 1,
    fontWeight: 700,

    // multiple background colors
    backgroundColor: [
      "3b82f6", // blue
      "8b5cf6", // violet
      "06b6d4", // cyan
      "ec4899", // pink
      "22c55e", // green
    ],

    // multiple text colors
    textColor: [
      "ffffff",
      "e2e8f0",
    ],
  });

  return avatar.toString();
}

export function Logo({ className, name }: { className?: string, name: string }) {
  return (
    <div
      className={cn("w-12 h-12", className)}
      dangerouslySetInnerHTML={{ __html: generateAvatar(name) }}
    />
  );
};