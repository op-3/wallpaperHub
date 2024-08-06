<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import type { Wallpaper } from '$lib/types/wallpaper';

  export let wallpaper: Wallpaper;

  const dispatch = createEventDispatcher();
  let imageLoaded = false;
  let imageError = false;
  let currentSrc = wallpaper.thumbs.large;

  function closeModal() {
    dispatch('close');
  }

  async function downloadImage(url: string, resolution: string) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = downloadUrl;
      a.download = `wallpaper_${wallpaper.id}_${resolution}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      window.open(url, '_blank');
    }
  }

  function loadFullImage() {
    const img = new Image();
    img.onload = () => {
      currentSrc = wallpaper.path;
      imageLoaded = true;
      imageError = false;
    };
    img.onerror = () => {
      imageLoaded = true;
      imageError = true;
    };
    img.src = wallpaper.path;
  }

  onMount(() => {
    document.body.classList.add('modal-open');
    const smallImg = new Image();
    smallImg.onload = () => {
      imageLoaded = true;
      loadFullImage();
    };
    smallImg.onerror = () => {
      imageError = true;
    };
    smallImg.src = wallpaper.thumbs.large;
  });

  onDestroy(() => {
    document.body.classList.remove('modal-open');
  });
</script>

<div class="modal modal-open" on:click|self={closeModal}>
  <div 
    class="modal-box w-11/12 max-w-5xl bg-base-200 overflow-y-auto"
    in:fly="{{ y: 50, duration: 300, easing: quintOut }}"
    out:fly="{{ y: 50, duration: 200 }}"
  >
    <h2 class="text-3xl font-bold mb-6 text-center text-primary">Wallpaper Details</h2>
    <div class="flex flex-col lg:flex-row gap-8">
      <div class="lg:w-2/3">
        <div class="relative rounded-lg overflow-hidden shadow-xl" style="aspect-ratio: {wallpaper.dimension_x / wallpaper.dimension_y};">
          {#if !imageLoaded && !imageError}
            <div class="absolute inset-0 flex items-center justify-center bg-base-300">
              <span class="loading loading-spinner loading-lg text-primary"></span>
            </div>
          {/if}
          {#if imageError}
            <div class="absolute inset-0 flex items-center justify-center bg-base-300">
              <div class="text-center">
                <p class="text-error text-xl mb-2">Failed to load image</p>
                <button class="btn btn-sm btn-primary" on:click={() => { imageError = false; imageLoaded = false; loadFullImage(); }}>
                  Retry
                </button>
              </div>
            </div>
          {/if}
          <img
            src={currentSrc}
            alt={`Wallpaper ${wallpaper.id}`}
            class="w-full h-full object-contain {imageLoaded ? '' : 'hidden'}"
          />
        </div>
      </div>
      <div class="lg:w-1/3 flex flex-col justify-between">
        <div>
          <div class="stats stats-vertical shadow w-full">
            <div class="stat">
              <div class="stat-title">Resolution</div>
              <div class="stat-value text-primary">{wallpaper.resolution}</div>
            </div>
            <div class="stat">
              <div class="stat-title">Category</div>
              <div class="stat-value text-secondary">{wallpaper.category}</div>
            </div>
          </div>
          <div class="divider"></div>
          <h3 class="text-xl font-semibold mb-2">Colors</h3>
          <div class="flex flex-wrap gap-2 mb-4">
            {#each wallpaper.colors as color}
              <div class="w-8 h-8 rounded-full" style="background-color: {color};" title={color}></div>
            {/each}
          </div>
        </div>
        <div class="space-y-2">
          <button on:click={() => downloadImage(wallpaper.path, 'original')} class="btn btn-primary btn-block">
            Download Original
          </button>
          <button on:click={() => downloadImage(wallpaper.thumbs.large, 'large')} class="btn btn-secondary btn-block">
            Download Large
          </button>
          <button on:click={() => downloadImage(wallpaper.thumbs.small, 'small')} class="btn btn-accent btn-block">
            Download Small
          </button>
        </div>
      </div>
    </div>
    <div class="modal-action">
      <button on:click={closeModal} class="btn btn-ghost">Close</button>
    </div>
  </div>
</div>

<style>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: flex-start;
    overflow-y: auto;
    z-index: 1000;
  }

  .modal-box {
    margin: 2rem auto;
    max-height: calc(100vh - 4rem);
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
  }

  .modal-box::-webkit-scrollbar {
    width: 8px;
  }

  .modal-box::-webkit-scrollbar-track {
    background: var(--scrollbar-track);
  }

  .modal-box::-webkit-scrollbar-thumb {
    background-color: var(--scrollbar-thumb);
    border-radius: 4px;
    border: 2px solid var(--scrollbar-track);
  }

  :global(html) {
    --scrollbar-thumb: hsl(var(--p) / 0.8);
    --scrollbar-track: hsl(var(--b1) / 0.8);
  }

  :global(body.modal-open) {
    overflow: hidden;
  }

  @media (max-width: 640px) {
    .modal-box {
      margin: 0;
      max-height: 100vh;
      height: 100vh;
      width: 100%;
      border-radius: 0;
    }
  }
</style>