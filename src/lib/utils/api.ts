export async function fetchWallpapers(
  page: number = 1,
  seed?: string,
  query?: string,
  resolution?: string,
  categories?: string
): Promise<ApiResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
  });

  if (seed) params.append("seed", seed);
  if (query) params.append("q", query);
  if (resolution) params.append("resolutions", resolution);
  if (categories) params.append("categories", categories);

  try {
    const response = await fetch(`/api/wallpapers?${params}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching wallpapers:", error);
    throw error;
  }
}
