<script lang="ts">
    import { createEventDispatcher } from 'svelte';
  
    const dispatch = createEventDispatcher();
    let searchTerm = '';
  
    function handleSubmit() {
      dispatch('search', searchTerm);
    }
  </script>
  
  <form on:submit|preventDefault={handleSubmit} class="form-control">
    <div class="input-group">
      <input
        type="text"
        bind:value={searchTerm}
        placeholder="Search wallpapers..."
        class="input input-bordered w-full"
      />
      <button type="submit" class="btn btn-square">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>
  </form>