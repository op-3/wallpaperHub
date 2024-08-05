<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  let searchTerm = '';

  function handleSubmit() {
    dispatch('search', searchTerm);
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="relative">
  <input
    type="text"
    bind:value={searchTerm}
    placeholder="Search wallpapers..."
    class="input input-bordered w-full pr-16"
  />
  <button type="submit" class="btn btn-primary absolute top-0 right-0 rounded-l-none">
    Search
  </button>
</form>