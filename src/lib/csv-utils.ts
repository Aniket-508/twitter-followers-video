import { FollowerData } from "@/contexts/config-context";
import Papa from "papaparse";

interface ParsedCSVResult {
  followers: FollowerData[];
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

        if (!nameField) {
          resolve({ followers: [], error: "CSV must have a 'name' column" });
          return;
        }

        const followers: FollowerData[] = (data as Record<string, string>[])
          .filter((row) => row[nameField])
          .map((row) => ({
            name: row[nameField],
            image:
              row[imgField || ""] ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(row[nameField])}`,
          }));

        resolve({ followers });
      },
      error: (error: Error) => {
        resolve({ followers: [], error: error.message });
      },
    });
  });
};
