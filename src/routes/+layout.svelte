<script lang="ts">
	import '../styles/style.css';
</script>

<svelte:head>
	<title>BB-Bob</title>
</svelte:head>

<slot />

<style>
	:global(html, body, h1, h2, h3, h4, p, span, button) {
		margin: 0;
		padding: 0;
		border: 0;
		box-sizing: border-box;
	}
</style>
