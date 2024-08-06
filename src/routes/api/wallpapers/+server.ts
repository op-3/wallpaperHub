import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

const API_BASE_URL = "https://wallhaven.cc/api/v1";
const API_KEY = "CGq7Z1EygDKI7B42RRg9pXcQ2AWuVQeM"; // Replace with your actual API key

export const GET: RequestHandler = async ({ url }) => {
  const page = url.searchParams.get("page") || "1";
  const seed = url.searchParams.get("seed") || "";
  const query = url.searchParams.get("q") || "";
  const resolutions = url.searchParams.get("resolutions") || "";
  const categories = url.searchParams.get("categories") || "111";
  const purity = "100"; // SFW only

  const params = new URLSearchParams({
    apikey: API_KEY,
    page,
    purity,
    categories,
  });

  if (seed) params.append("seed", seed);
  if (query) params.append("q", query);
  if (resolutions) params.append("resolutions", resolutions);

  try {
    console.log("Fetching from URL:", `${API_BASE_URL}/search?${params}`); // Add this line for debugging
    const response = await fetch(`${API_BASE_URL}/search?${params}`);

    if (!response.ok) {
      throw error(response.status, "Failed to fetch wallpapers");
    }

    const data = await response.json();
    console.log("API Response:", data); // Add this line for debugging
    return json(data);
  } catch (err) {
    console.error("Error fetching wallpapers:", err);
    throw error(500, "Internal server error");
  }
};
