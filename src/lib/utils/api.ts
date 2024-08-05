import type { ApiResponse } from "$lib/types/wallpaper";

export async function fetchWallpapers(
  page: number = 1,
  seed?: string,
  query?: string
): Promise<ApiResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
  });

  if (seed) {
    params.append("seed", seed);
  }

  if (query) {
    params.append("q", query);
  }

  const response = await fetch(`/api/wallpapers?${params}`);

  if (!response.ok) {
    throw new Error("Failed to fetch wallpapers");
  }

  return response.json();
}
