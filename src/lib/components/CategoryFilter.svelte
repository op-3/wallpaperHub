<script lang="ts">
    import { createEventDispatcher } from 'svelte';
  
    const dispatch = createEventDispatcher();
  
    let categories = [
      { value: '100', label: 'General' },
      { value: '010', label: 'Anime' },
      { value: '001', label: 'People' },
    ];
  
    let selectedCategories = ['100', '010', '001'];
  
    function handleChange() {
      dispatch('filterChange', selectedCategories.join(''));
    }
  </script>
  
  <div class="flex flex-wrap gap-4">
    {#each categories as category}
      <label class="cursor-pointer flex items-center">
        <input 
          type="checkbox" 
          class="checkbox checkbox-primary mr-2" 
          bind:group={selectedCategories} 
          value={category.value}
          on:change={handleChange}
        />
        <span>{category.label}</span>
      </label>
    {/each}
  </div>