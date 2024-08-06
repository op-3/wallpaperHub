import type { ApiResponse } from "$lib/types/wallpaper";

export async function fetchWallpapers(
  page: number = 1,
  seed?: string,
  query?: string,
  resolution?: string,
  categories?: string
): Promise<ApiResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    purity: "100", // SFW only
    apikey: "YOUR_API_KEY_HERE", // Replace with your actual API key
  });

  if (seed) params.append("seed", seed);
  if (query) params.append("q", query);
  if (resolution) params.append("resolutions", resolution);
  if (categories) params.append("categories", categories);

  const response = await fetch(`/api/wallpapers?${params}`);

  if (!response.ok) {
    throw new Error("Failed to fetch wallpapers");
  }

  const data = await response.json();
  console.log("API Response:", data); // Add this line for debugging
  return data;
}
