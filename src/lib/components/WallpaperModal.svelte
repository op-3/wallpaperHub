<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Wallpaper } from '$lib/types/wallpaper';
  
    export let wallpaper: Wallpaper;
  
    const dispatch = createEventDispatcher();
  
    function closeModal() {
      dispatch('close');
    }
  
    function downloadImage(url: string, resolution: string) {
      const link = document.createElement('a');
      link.href = url;
      link.download = `wallpaper_${wallpaper.id}_${resolution}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  </script>
  
  <div class="modal modal-open">
    <div class="modal-box w-11/12 max-w-5xl">
      <h3 class="font-bold text-lg mb-4">Wallpaper Details</h3>
      <img src={wallpaper.path} alt={`Wallpaper ${wallpaper.id}`} class="w-full h-auto mb-4 rounded-lg" />
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="stat">
          <div class="stat-title">Resolution</div>
          <div class="stat-value text-primary">{wallpaper.resolution}</div>
        </div>
        <div class="stat">
          <div class="stat-title">Category</div>
          <div class="stat-value text-secondary">{wallpaper.category}</div>
        </div>
        <div class="stat">
          <div class="stat-title">Views</div>
          <div class="stat-value">{wallpaper.views.toLocaleString()}</div>
        </div>
        <div class="stat">
          <div class="stat-title">Favorites</div>
          <div class="stat-value">{wallpaper.favorites.toLocaleString()}</div>
        </div>
      </div>
      <div class="flex flex-wrap gap-2 justify-center">
        <button on:click={() => downloadImage(wallpaper.path, 'original')} class="btn btn-primary">
          Download Original
        </button>
        <button on:click={() => downloadImage(wallpaper.thumbs.large, 'large')} class="btn btn-secondary">
          Download Large
        </button>
        <button on:click={() => downloadImage(wallpaper.thumbs.small, 'small')} class="btn btn-accent">
          Download Small
        </button>
      </div>
      <div class="modal-action">
        <button on:click={closeModal} class="btn">Close</button>
      </div>
    </div>
  </div>