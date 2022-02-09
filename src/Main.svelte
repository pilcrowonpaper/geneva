<script>
    import { fade, fly } from "svelte/transition";
    import { onMount } from "svelte";

    import Three2 from "./Three2.svelte"
    
    let pageLoad = true
</script>

<div class="h-screen w-screen">
    {#if pageLoad}
        <Three2/>
    {/if}
</div>

<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>