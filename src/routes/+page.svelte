<script lang="ts">
	import { highfiveCountStore } from '$lib/store/highfive-store';
	import { supabase } from '$lib/supabase/supabase-client';
	import { utils } from '$lib/utils';
	import { onMount } from 'svelte';

	let typewriter = utils.motion.typewriter;

	let openMouth = false;
	let closeEyes = false;

	let firstTear = false;
	let secondTear = false;

	let wait = false;

	let visible = false;
	let started = false;

	let leftButtonLabel = 'start';

	let greetings: HTMLElement | null = null;
	let greetingMessage = 'Hello there, my name is BB-Bob.';

	$: finished = greetings?.textContent === greetingMessage;

	function start() {
		if (!started) {
			started = true;
			moveMouth();
		}
	}

	function moveMouth() {
		if (wait) return;
		wait = true;

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
					wait = false;
				}, 200);
			}
		}, 500);
	}

	function blink() {
		if (wait) return;
		wait = true;

		const interval = setInterval(() => {
			closeEyes = !closeEyes;
		}, 500);

		setTimeout(() => {
			clearInterval(interval);
			closeEyes = false;
			wait = false;
		}, 1000);
	}

	function cry() {
		if (wait) return;
		wait = true;

		closeEyes = true;

		setTimeout(() => {
			firstTear = true;
		}, 500);

		setTimeout(() => {
			firstTear = false;
			secondTear = true;
		}, 1000);

		setTimeout(() => {
			firstTear = true;
			secondTear = false;
		}, 1500);

		setTimeout(() => {
			firstTear = false;
			secondTear = true;
		}, 2000);

		setTimeout(() => {
			closeEyes = false;
			secondTear = false;
			wait = false;
		}, 2500);
	}

	async function highFive() {
		const { error } = await supabase.from('highfive').insert({
			user_agent: navigator.userAgent,
			time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone
		});
		if (error) {
			console.log(error);
		}
	}

	async function fetchHighfives() {
		const { count, error } = await supabase.from('highfive').select('*', { count: 'exact' });

		if (error) {
			console.log(error);
			return;
		}

		if (count) {
			highfiveCountStore.update((n) => count);
		}
	}

	onMount(() => {
		setInterval(() => {
			blink();
		}, 5000);

		fetchHighfives();

		supabase
			.channel('public:highfive')
			.on('postgres_changes', { event: '*', schema: 'public', table: 'highfive' }, (payload) => {
				fetchHighfives();
			})
			.subscribe();
	});
</script>

<div class="bb-bob">
	<div class="face">
		<div class="eyes">
			<div class="eye-wrapper">
				<div class="eye eye--left" class:eye--close={closeEyes} />
				<div class="tear" class:tear--fall-20={firstTear} class:tear--fall-30={secondTear} />
			</div>

			<div class="eye-wrapper">
				<div class="eye eye--right" class:eye--close={closeEyes} />
				<div class="tear" class:tear--fall-20={firstTear} class:tear--fall-30={secondTear} />
			</div>
		</div>
		<div class="mouth" class:mouth--open={openMouth} />
	</div>

	<div class="text-wrapper">
		{#if visible}
			<p id="greetings" transition:typewriter>{greetingMessage}</p>
		{/if}
	</div>

	<div class="hello-wrapper">
		{#if !started}
			<button on:click={start}>
				{leftButtonLabel}
			</button>
		{:else}
			<div class="bottom-wrapper">
				<div class="button-wrapper">
					<button on:click={blink}>blink</button>
					<button on:click={cry}>cry</button>
					<button on:click={highFive}>✋</button>
				</div>

				<p>high fives: {$highfiveCountStore}</p>
			</div>
		{/if}
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
		display: flex;
		justify-content: space-between;
		width: 120px;
		height: 50px;
	}

	.eye-wrapper {
		position: relative;
		height: 30px;
		width: 30px;
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

	.tear {
		visibility: hidden;
		position: absolute;
		left: 10px;
		width: 10px;
		height: 10px;
		background: #222222;

		&--fall-20 {
			bottom: -20px;
			visibility: visible;
		}
		&--fall-30 {
			bottom: -30px;
			visibility: visible;
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
		width: 208px;
		margin-top: 40px;
		display: flex;
		justify-content: center;
		gap: 10px;
		transition: all 1s;
	}

	/* From uiverse.io by @adamgiebl */
	button {
		color: #090909;
		padding: 0.4em 1.7em;
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
	.bottom-wrapper {
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 20px;
	}

	.button-wrapper {
		display: flex;
		gap: 10px;
	}
</style>
