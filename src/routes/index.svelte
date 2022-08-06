<script lang="ts">
	import { onMount } from 'svelte';

	let openMouth = false;
	let visible = false;

	function moveMouth() {
		openMouth = !openMouth;
		setTimeout(moveMouth, 500);
		visible = true;
	}

	function typewriter(node: HTMLParagraphElement, options: unknown) {
		console.log(node, options);
		let speed = 1;

		const valid = node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE;

		if (!valid) {
			throw new Error(`This transition only works on elements with a single text node child`);
		}

		const text = node.textContent || '';

		const duration = text.length / (speed * 0.01);

		return {
			duration,
			tick: (t: number) => {
				const i = Math.trunc(text.length * t);
				node.textContent = text.slice(0, i);
			}
		};
	}

	onMount(() => {
		moveMouth();
	});
</script>

<div class="bb-bob">
	<div class="face">
		<div class="eyes">
			<div class="eye" />
			<div class="eye" />
		</div>
		<div class="mouth" class:mouth--open={openMouth} />
	</div>

	{#if visible}
		<p transition:typewriter>Hello there, my name is Bob.</p>
	{/if}
</div>

<style lang="scss">
	.bb-bob {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100vh;
		width: 100vw;
		background-color: #f0f0f0;
	}
	.face {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		height: 100px;
	}
	.eyes {
		display: flex;
		justify-content: center;
		gap: 60px;
	}
	.eye {
		width: 30px;
		height: 50px;
		background: #222222;
		transition: height 1s ease-in-out;
	}
	.mouth {
		width: 30px;
		height: 10px;
		background: #222222;
		transition: height 1s ease-in-out;

		&--open {
			height: 30px;
		}
	}
</style>
