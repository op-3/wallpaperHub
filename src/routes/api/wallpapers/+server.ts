import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

const API_BASE_URL = "https://wallhaven.cc/api/v1";
const API_KEY = "CGq7Z1EygDKI7B42RRg9pXcQ2AWuVQeM"; // استبدل هذا بمفتاح API الخاص بك

export const GET: RequestHandler = async ({ url }) => {
  const page = url.searchParams.get("page") || "1";
  const seed = url.searchParams.get("seed") || "";
  const query = url.searchParams.get("q") || "";

  const params = new URLSearchParams({
    apikey: API_KEY,
    sorting: "random",
    page,
    seed,
  });

  if (query) {
    params.append("q", query);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/search?${params}`);

    if (!response.ok) {
      throw error(response.status, "Failed to fetch wallpapers");
    }

    const data = await response.json();
    return json(data);
  } catch (err) {
    console.error("Error fetching wallpapers:", err);
    throw error(500, "Internal server error");
  }
};
