import type { Follower } from "@/types/schema";
import { getDicebearUrl } from "@/remotion/follower-accumulation/utils";
import Papa from "papaparse";

interface ParsedCSVResult {
  followers: Follower[];
  error?: string;
}

export const parseFollowersCSV = async (
  text: string,
): Promise<ParsedCSVResult> => {
  return new Promise((resolve) => {
    Papa.parse(text, {
      header: true,
      skipEmptyLines: "greedy",
      complete: (results) => {
        const { data, meta } = results;
        const headers = meta.fields || [];

        const nameField = headers.find(
          (h) =>
            h.toLowerCase().includes("name") ||
            h.toLowerCase().includes("user"),
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
          v.toLowerCase().includes("is_blue_verified"),
        );

        if (!nameField) {
          resolve({ followers: [], error: "CSV must have a 'name' column" });
          return;
        }

        const followers: Follower[] = (data as Record<string, string>[])
          .filter((row) => row[nameField])
          .map((row) => {
            return {
              name: row[nameField],
              image: row[imgField || ""] || getDicebearUrl(row[nameField]),
              verified: row[verifiedField || ""] === "true",
            };
          });

        resolve({ followers });
      },
      error: (error: Error) => {
        resolve({ followers: [], error: error.message });
      },
    });
  });
};
