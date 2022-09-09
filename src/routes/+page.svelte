<script lang="ts">
	import { utils } from '$lib/utils';

	let process: any;

	const p = process?.env ? process.env : import.meta.env;

	let typewriter = utils.motion.typewriter;

	let openMouth = false;
	let closeEyes = false;
	let visible = false;
	let started = false;

	let leftButtonLabel = 'start';

	let greetings: HTMLElement | null = null;
	let greetingMessage = 'Hello there, my name is BB-Bob.';

	$: finished = greetings?.textContent === greetingMessage;

	function start() {
		if (!started) {
			started = true;
			leftButtonLabel = 'tell me something';
			moveMouth();
		} else {
			getFact();
		}
	}

	function moveMouth() {
		visible = true;
		setTimeout(() => {
			blink();
		}, 200);

		const interval = setInterval(() => {
			openMouth = !openMouth;

			greetings = document.getElementById('greetings');

			if (finished) {
				clearInterval(interval);
				openMouth = false;
				setTimeout(() => {
					blink();
				}, 200);
			}
		}, 500);
	}

	function blink() {
		const interval = setInterval(() => {
			closeEyes = !closeEyes;
		}, 500);

		setTimeout(() => {
			clearInterval(interval);
			closeEyes = false;
		}, 1000);
	}

	async function getFact(): Promise<string> {
		const limit = 1;
		const url = `https://api.api-ninjas.com/v1/facts?limit=${limit}`;
		const response = await fetch(url, {
			headers: {
				'X-Api-Key': p.VITE_NINJA_API_KEY,
				contentType: 'application/json'
			}
		});

		let result = [];
		if (response.ok) {
			visible = false;

			result = await response.json();

			if (result.length > 0) {
				greetingMessage = result[0].fact;
				visible = true;
			}
		}
		return '';
	}
</script>

<div class="bb-bob">
	<div class="face">
		<div class="eyes">
			<div class="eye eye--left" class:eye--close={closeEyes} />
			<div class="eye eye--right" class:eye--close={closeEyes} />
		</div>
		<div class="mouth" class:mouth--open={openMouth} />
	</div>

	<div class="text-wrapper">
		{#if visible}
			<p id="greetings" transition:typewriter>{greetingMessage}</p>
		{/if}
	</div>

	<div class="hello-wrapper">
		<button on:click={start}>{leftButtonLabel}</button>
		<button on:click={blink}>blink</button>
	</div>
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
		position: relative;
		width: 120px;
		height: 50px;
	}
	.eye {
		position: absolute;
		bottom: 0;
		width: 30px;
		background: #222222;
		transition: all 0.5s;
		height: 50px;
		transform: scale(1);
		&--left {
			top: 0;
			left: 0;
		}
		&--right {
			top: 0;
			right: 0;
		}
		&--close {
			transform: scale(1, 0.2);
		}
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

	.text-wrapper {
		height: 40px;
	}

	.hello-wrapper {
		margin-top: 40px;
		display: flex;
		gap: 10px;
	}

	/* From uiverse.io by @adamgiebl */
	button {
		color: #090909;
		padding: 0.7em 1.7em;
		font-size: 18px;
		border-radius: 0.5em;
		background: #e8e8e8;
		border: 1px solid #e8e8e8;
		transition: all 0.3s;
		box-shadow: 6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff;
		cursor: pointer;
	}

	button:active {
		box-shadow: 4px 4px 12px #c5c5c5, -4px -4px 12px #ffffff;
	}
</style>
