<script lang="ts">
    import { createEventDispatcher } from 'svelte';
  
    const dispatch = createEventDispatcher();
  
    let resolutions = [
      { value: '', label: 'All Resolutions' },
      { value: '1920x1080', label: '1920x1080 (FHD)' },
      { value: '2560x1440', label: '2560x1440 (QHD)' },
      { value: '3840x2160', label: '3840x2160 (4K)' },
      { value: '7680x4320', label: '7680x4320 (8K)' },
    ];
  
    let selectedResolution = '';
  
    function handleChange() {
      dispatch('filterChange', selectedResolution);
    }
  </script>
  
  <select 
    bind:value={selectedResolution} 
    on:change={handleChange}
    class="select select-bordered w-full"
  >
    {#each resolutions as resolution}
      <option value={resolution.value}>{resolution.label}</option>
    {/each}
  </select>