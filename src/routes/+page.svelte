<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { fetchWallpapers } from '$lib/utils/api';
  import type { Wallpaper } from '$lib/types/wallpaper';
  import WallpaperModal from '$lib/components/WallpaperModal.svelte';
  import WallpaperCard from '$lib/components/WallpaperCard.svelte';
  import FilterSection from '$lib/components/FilterSection.svelte';

  let wallpapers: Wallpaper[] = [];
  let currentPage = 1;
  let seed: string | null = null;
  let loading = false;
  let hasMore = true;
  let searchQuery = '';
  let selectedResolution = '';
  let selectedCategories = '111';
  let selectedWallpaper: Wallpaper | null = null;
  let showModal = false;
  let mounted = false;

  async function loadWallpapers(reset: boolean = false) {
    if (loading || (!hasMore && !reset)) return;

    loading = true;
    try {
      if (reset) {
        currentPage = 1;
        wallpapers = [];
        seed = null;
      }
      const response = await fetchWallpapers(currentPage, seed, searchQuery, selectedResolution, selectedCategories);
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

  function handleResolutionChange(event: CustomEvent<string>) {
    selectedResolution = event.detail;
    loadWallpapers(true);
  }

  function handleCategoryChange(event: CustomEvent<string>) {
    selectedCategories = event.detail;
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
    document.body.classList.add('modal-open');
  }

  function closeModal() {
    showModal = false;
    selectedWallpaper = null;
    document.body.classList.remove('modal-open');
  }

  onMount(() => {
    loadWallpapers();
    window.addEventListener('scroll', handleScroll);
    mounted = true;
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  afterUpdate(() => {
    const wallpaperElements = document.querySelectorAll('.wallpaper-card');
    wallpaperElements.forEach((element, index) => {
      element.removeEventListener('click', () => openModal(wallpapers[index]));
      element.addEventListener('click', () => openModal(wallpapers[index]));
    });
  });
</script>

<svelte:window on:scroll={handleScroll} />

{#if mounted}
  <main in:fade="{{ duration: 300, delay: 300 }}" class="container mx-auto p-4">
    <h1 
      in:fly="{{ y: -50, duration: 500, delay: 500, easing: quintOut }}" 
      class="text-5xl font-bold mb-8 text-center text-primary"
    >
      Wallpaper Explorer
    </h1>
    
    <FilterSection 
      on:search={handleSearch}
      on:resolutionChange={handleResolutionChange}
      on:categoryChange={handleCategoryChange}
    />
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {#each wallpapers as wallpaper, index (wallpaper.id)}
        <div 
          class="wallpaper-card"
          tabindex="0" 
          role="button"
        >
          <WallpaperCard {wallpaper} {index} />
        </div>
      {/each}
    </div>

    {#if loading}
      <div class="flex justify-center mt-8">
        <button class="btn btn-primary loading">Loading</button>
      </div>
    {/if}

    {#if !loading && wallpapers.length === 0}
      <div in:fade class="text-center mt-8">
        <p class="text-xl">No wallpapers found. Try adjusting your filters.</p>
      </div>
    {/if}
  </main>
{/if}

{#if selectedWallpaper && showModal}
  <WallpaperModal wallpaper={selectedWallpaper} on:close={closeModal} />
{/if}

<style>
  :global(body) {
    overflow-x: hidden;
  }

  :global(body.modal-open) {
    overflow: hidden;
  }
</style>