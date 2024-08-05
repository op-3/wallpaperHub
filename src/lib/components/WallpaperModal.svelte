<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { fly, fade, scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import type { Wallpaper } from '$lib/types/wallpaper';
  import { stop, start } from '$lib/utils/smoothScroll';

  export let wallpaper: Wallpaper;

  const dispatch = createEventDispatcher();
  let imageLoaded = false;
  let imageError = false;
  let currentSrc = wallpaper.thumbs.large;
  let modalContent: HTMLElement;

  function closeModal() {
    dispatch('close');
  }

  async function downloadImage() {
    try {
      const response = await fetch(wallpaper.path);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `wallpaper_${wallpaper.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      // Open image in new tab as fallback
      window.open(wallpaper.path, '_blank');
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
      imageError = false;
    };
    img.src = wallpaper.path;
  }

  onMount(() => {
    stop(); // إيقاف التمرير السلس في الصفحة الرئيسية
    const smallImg = new Image();
    smallImg.onload = () => {
      imageLoaded = true;
      loadFullImage();
    };
    smallImg.onerror = () => {
      imageError = true;
    };
    smallImg.src = wallpaper.thumbs.large;

    // إضافة مستمع لعجلة الماوس للتمرير داخل المودال
    const handleWheel = (e: WheelEvent) => {
      if (modalContent) {
        e.preventDefault();
        modalContent.scrollTop += e.deltaY;
      }
    };
    modalContent?.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      modalContent?.removeEventListener('wheel', handleWheel);
    };
  });

  onDestroy(() => {
    start(); // إعادة تشغيل التمرير السلس عند إغلاق المودال
  });
</script>

<div class="modal modal-open" in:fade="{{ duration: 300 }}" out:fade="{{ duration: 200 }}">
  <div 
    bind:this={modalContent}
    class="modal-box w-11/12 max-w-5xl bg-base-200 max-h-[90vh] overflow-y-auto"
    in:fly="{{ y: 50, duration: 500, easing: quintOut }}"
    out:fly="{{ y: 50, duration: 300 }}"
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
            <!-- <div class="stat">
              <div class="stat-title">Views</div>
              <div class="stat-value">{wallpaper.views.toLocaleString()}</div>
            </div>
            <div class="stat">
              <div class="stat-title">Favorites</div>
              <div class="stat-value">{wallpaper.favorites.toLocaleString()}</div>
            </div> -->
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
  .modal-box {
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
</style>