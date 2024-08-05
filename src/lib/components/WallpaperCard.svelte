<script lang="ts">
    import { fly, fade } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import type { Wallpaper } from '$lib/types/wallpaper';
    export let wallpaper: Wallpaper;
    export let index: number;
  </script>
  
  <div 
    class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
    in:fly="{{ y: 50, duration: 500, delay: index * 100, easing: quintOut }}"
    out:fade="{{ duration: 300 }}"
  >
    <figure class="relative aspect-video overflow-hidden">
      <img 
        src={wallpaper.thumbs.large} 
        alt={`Wallpaper ${wallpaper.id}`} 
        class="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
      />
      <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 transform translate-y-full transition-transform duration-300 hover:translate-y-0">
        <p class="text-white font-semibold">{wallpaper.resolution}</p>
      </div>
    </figure>
    <div class="card-body p-4">
      <div class="flex justify-between items-center">
        <span class="badge badge-primary">{wallpaper.category}</span>
        <div class="flex items-center space-x-2">
          <span class="text-sm">{wallpaper.views} views</span>
          <!-- <span class="text-sm">{wallpaper.favorites} favs</span> -->
        </div>
      </div>
    </div>
  </div>
  
  <style>
    .card {
      backface-visibility: hidden;
    }
  </style>