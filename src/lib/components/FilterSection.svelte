<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import SearchBar from './SearchBar.svelte';
    import ResolutionFilter from './ResolutionFilter.svelte';
    import CategoryFilter from './CategoryFilter.svelte';
    import { fade, fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  
  
    const dispatch = createEventDispatcher();
  
    function handleSearch(event: CustomEvent<string>) {
      dispatch('search', event.detail);
    }
  
    function handleResolutionChange(event: CustomEvent<string>) {
      dispatch('resolutionChange', event.detail);
    }
  
    function handleCategoryChange(event: CustomEvent<string>) {
      dispatch('categoryChange', event.detail);
    }
  </script>
  
  <div 
  class="bg-base-200 p-6 rounded-lg shadow-lg mb-8"
  in:fly="{{ y: -20, duration: 500, delay: 800, easing: quintOut }}"
  out:fade
>
  <div class="flex flex-col lg:flex-row justify-between items-stretch gap-6 mb-6">
    <div class="flex-grow" in:fade="{{ delay: 1000, duration: 300 }}">
      <h2 class="text-2xl font-semibold mb-3">Search</h2>
      <SearchBar on:search={handleSearch} />
    </div>
    <div class="flex-grow" in:fade="{{ delay: 1200, duration: 300 }}">
      <h2 class="text-2xl font-semibold mb-3">Resolution</h2>
      <ResolutionFilter on:filterChange={handleResolutionChange} />
    </div>
  </div>
  <div in:fade="{{ delay: 1400, duration: 300 }}">
    <h2 class="text-2xl font-semibold mb-3">Categories</h2>
    <CategoryFilter on:filterChange={handleCategoryChange} />
  </div>
</div>