<script lang="ts">
  import { setupShortcuts, useShortcut } from '@/svelte';

  // svelte-ignore state_referenced_locally
  let { onFire, skipSetup = false }: { onFire: () => void; skipSetup?: boolean } =
    $props();

  if (!skipSetup) {
    setupShortcuts();
  }
  // svelte-ignore state_referenced_locally
  useShortcut('CTRL+SHIFT+F', onFire);
</script>
