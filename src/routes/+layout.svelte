<script lang="ts">
  import '../app.css';
  import { onMount, onDestroy } from 'svelte';
  import { initSmoothScroll, destroy } from '$lib/utils/smoothScroll';

  onMount(() => {
    initSmoothScroll();
  });

  onDestroy(() => {
    destroy();
  });
</script>

<slot />