<script lang="ts">
    import { onMount } from 'svelte';
    import { fetchWallpapers } from '$lib/utils/api';
    import type { Wallpaper } from '$lib/types/wallpaper';
    import SearchBar from '$lib/components/SearchBar.svelte';
    import WallpaperModal from '$lib/components/WallpaperModal.svelte';
  
    let wallpapers: Wallpaper[] = [];
    let currentPage = 1;
    let seed: string | null = null;
    let loading = false;
    let hasMore = true;
    let searchQuery = '';
    let selectedWallpaper: Wallpaper | null = null;
    let showModal = false;
  
    async function loadWallpapers(reset: boolean = false) {
      if (loading || (!hasMore && !reset)) return;
  
      loading = true;
      try {
        if (reset) {
          currentPage = 1;
          wallpapers = [];
          seed = null;
        }
        const response = await fetchWallpapers(currentPage, seed, searchQuery);
        wallpapers = reset ? response.data : [...wallpapers, ...response.data];
        seed = response.meta.seed;
        currentPage++;
        hasMore = currentPage <= response.meta.last_page;
      } catch (error) {
        console.error('Error loading wallpapers:', error);
      } finally {
        loading = false;
      }
    }
  
    function handleSearch(event: CustomEvent<string>) {
      searchQuery = event.detail;
      loadWallpapers(true);
    }
  
    function handleScroll() {
      const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 100;
      if (bottom && !loading && hasMore) {
        loadWallpapers();
      }
    }
  
    function openModal(wallpaper: Wallpaper) {
      selectedWallpaper = wallpaper;
      showModal = true;
    }
  
    function closeModal() {
      showModal = false;
      selectedWallpaper = null;
    }
  
    onMount(() => {
      loadWallpapers();
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    });
  </script>
  
  <svelte:window on:scroll={handleScroll} />
  
  <main class="container mx-auto p-4">
    <h1 class="text-4xl font-bold mb-6 text-center">Wallpaper Explorer</h1>
    
    <SearchBar on:search={handleSearch} />
    
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
      {#each wallpapers as wallpaper (wallpaper.id)}
        <div 
          class="card bg-base-100 shadow-xl cursor-pointer transition-all duration-300 hover:scale-105"
          on:click={() => openModal(wallpaper)}
          on:keydown={(e) => e.key === 'Enter' && openModal(wallpaper)}
          tabindex="0"
          role="button"
        >
          <figure><img src={wallpaper.thumbs.large} alt={`Wallpaper ${wallpaper.id}`} class="w-full h-48 object-cover" /></figure>
          <div class="card-body p-4">
            <p class="text-sm opacity-70">Resolution: {wallpaper.resolution}</p>
          </div>
        </div>
      {/each}
    </div>
  
    {#if loading}
      <div class="flex justify-center mt-8">
        <button class="btn btn-primary loading">Loading</button>
      </div>
    {/if}
  </main>
  
  {#if selectedWallpaper && showModal}
    <WallpaperModal wallpaper={selectedWallpaper} on:close={closeModal} />
  {/if}