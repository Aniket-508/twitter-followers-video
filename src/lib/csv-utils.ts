import Papa from "papaparse";

import { getDicebearUrl } from "@/remotion/templates/shared/utils";
import type { Follower } from "@/types/schema";

interface ParsedCSVResult {
  followers: Follower[];
  error?: string;
}

export const parseFollowersCSV = (text: string): ParsedCSVResult => {
  const { data, errors, meta } = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: "greedy",
  });

  if (errors[0]) {
    return { error: errors[0].message, followers: [] };
  }

  const headers = meta.fields || [];
  const nameField = headers.find(
    (h) => h.toLowerCase().includes("name") || h.toLowerCase().includes("user")
  );
  const imgField = headers.find((h) => {
    const lower = h.toLowerCase();
    return (
      lower.includes("avatar_image_url") ||
      lower.includes("image") ||
      lower.includes("avatar") ||
      lower.includes("url") ||
      lower.includes("img")
    );
  });
  const verifiedField = headers.find((v) =>
    v.toLowerCase().includes("is_blue_verified")
  );

  if (!nameField) {
    return { error: "CSV must have a 'name' column", followers: [] };
  }

  const followers: Follower[] = data
    .filter((row) => row[nameField])
    .map((row) => ({
      image: row[imgField || ""] || getDicebearUrl(row[nameField]),
      name: row[nameField],
      verified: row[verifiedField || ""] === "true",
    }));

  return { followers };
};
