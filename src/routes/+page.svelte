<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { quintOut, elasticOut, backOut, cubicOut } from 'svelte/easing';
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
  let ready = false;

  function flyAndScale(node, {
    delay = 0,
    duration = 400,
    easing = cubicOut,
    x = 0,
    y = 0,
    start = 0.8
  }) {
    const style = getComputedStyle(node);
    const target_opacity = +style.opacity;
    const transform = style.transform === 'none' ? '' : style.transform;

    return {
      delay,
      duration,
      easing,
      css: (t, u) => `
        transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px) scale(${start + (1 - start) * t});
        opacity: ${target_opacity * t}`
    };
  }

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
  }

  function closeModal() {
    showModal = false;
    selectedWallpaper = null;
  }

  function getRandomDelay(index: number): number {
    return 100 + Math.random() * 300 + index * 50;
  }

  function getRandomDirection(): { x: number, y: number } {
    const directions = [
      { x: -20, y: 20 },
      { x: 20, y: 20 },
      { x: 0, y: 30 },
      { x: -30, y: 0 },
      { x: 30, y: 0 },
    ];
    return directions[Math.floor(Math.random() * directions.length)];
  }

  onMount(() => {
    loadWallpapers();
    window.addEventListener('scroll', handleScroll);
    mounted = true;
    setTimeout(() => {
      ready = true;
    }, 500);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
</script>

<svelte:window on:scroll={handleScroll} />

{#if mounted}
  <main in:fade="{{ duration: 500, delay: 300 }}" class="container mx-auto p-4">
    <h1 
      in:fly="{{ y: -50, duration: 800, delay: 500, easing: elasticOut }}" 
      class="text-5xl font-bold mb-8 text-center text-primary"
    >
      Wallpaper Hub
    </h1>
    
    <div in:fly="{{ y: 50, duration: 800, delay: 700, easing: quintOut }}">
      <FilterSection 
        on:search={handleSearch}
        on:resolutionChange={handleResolutionChange}
        on:categoryChange={handleCategoryChange}
      />
    </div>
    
    {#if ready}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {#each wallpapers as wallpaper, index (wallpaper.id)}
          {@const direction = getRandomDirection()}
          <div 
            in:fade="{{ duration: 300, delay: getRandomDelay(index) }}"
            out:fade="{{ duration: 200 }}"
            animate:flip="{{ duration: 500 }}"
            class="wallpaper-card-container"
          >
            <div
              use:flyAndScale="{{ 
                delay: getRandomDelay(index), 
                duration: 800, 
                x: direction.x, 
                y: direction.y, 
                start: 0.8, 
                easing: backOut 
              }}"
              on:click={() => openModal(wallpaper)}
              on:keydown={(e) => e.key === 'Enter' && openModal(wallpaper)}
              tabindex="0" 
              role="button"
              class="wallpaper-card transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:rotate-1"
            >
              <WallpaperCard {wallpaper} />
            </div>
          </div>
        {/each}
      </div>
    {/if}

    {#if loading}
      <div class="flex justify-center mt-8" in:fade="{{ duration: 300 }}">
        <button class="btn btn-primary loading animate-pulse">Loading</button>
      </div>
    {/if}

    {#if !loading && wallpapers.length === 0}
      <div in:fade="{{ duration: 300 }}" class="text-center mt-8">
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

  .wallpaper-card {
    backface-visibility: hidden;
    animation: colorize 0.5s ease-out forwards;
  }

  .wallpaper-card-container {
    perspective: 1000px;
  }

  @keyframes colorize {
    from { filter: saturate(0) brightness(1.2); }
    to { filter: saturate(1) brightness(1); }
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: .5; }
  }

  .fade-in {
    animation: fadeIn 0.5s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .slide-up {
    animation: slideUp 0.5s ease-out;
  }

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
</style>