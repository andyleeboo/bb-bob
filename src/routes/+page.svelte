<script lang="ts">
	import { analytics, firestore } from '$lib/firebase';
	import type { HighFive } from '$lib/model/high-five';
	import { highfiveCountStore } from '$lib/store/highfive-store';
	import { logEvent } from 'firebase/analytics';
	import { addDoc, collection, getCountFromServer } from 'firebase/firestore';
	import { onMount } from 'svelte';

	let openMouth = false;
	let closeEyes = false;

	let firstTear = false;
	let secondTear = false;

	let wait = false;

	let started = false;

	let greetings: HTMLElement | null = null;

	$: greetingMessage = '안녕하세요. 저는 BB-Bob 입니다.';
	$: finished = greetings?.textContent === greetingMessage;

	function start() {
		if (!started) {
			started = true;
		}
	}

	function moveMouth() {
		if (wait) return;
		wait = true;

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
		saySomethingRandomly();
		logEvent(analytics, 'high_fived', {
			userId: null
		});

		const data: HighFive = {
			userAgent: navigator.userAgent,
			timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
			userId: null,
			email: null
		};

		await addDoc(collection(firestore, 'high_five'), data);
		await fetchHighfives();
	}

	function saySomethingRandomly() {
		const random = Math.floor(Math.random() * 4);
		switch (random) {
			case 0:
				greetingMessage = '하이파이브! 반가워요!';
				break;
			case 1:
				greetingMessage = '제가 손이 없지만 하이파이브 좋네요.';
				break;
			case 2:
				greetingMessage = '✋';
				break;
			case 3:
				greetingMessage = '앗 힘이 세네요! 아팠어요 😭';
				cry();
				break;
		}
		finished = true;
	}

	async function fetchHighfives() {
		const snapshot = await getCountFromServer(collection(firestore, 'high_five'));
		const count = await snapshot.data().count;
		highfiveCountStore.set(count);
	}

	onMount(() => {
		document.addEventListener('touchstart', function (event) {
			if (event.touches.length > 1) {
				// Cancel zoom behavior
				event.preventDefault();
			}
		});
		document.addEventListener('touchend', function (event) {
			if (event.touches.length > 1) {
				// Cancel zoom behavior
				event.preventDefault();
			}
		});

		setInterval(() => {
			blink();
		}, 3000);

		start();

		fetchHighfives();
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
		<p>{greetingMessage}</p>
	</div>

	<div class="hello-wrapper">
		{#if !started}
			<!-- <button on:click={start}>
				{leftButtonLabel}
			</button> -->
		{:else}
			<div class="bottom-wrapper">
				<div class="button-wrapper">
					<!-- <button on:click={blink}>blink</button>
					<button on:click={cry}>cry</button> -->
					<button on:click={highFive}>✋</button>
				</div>

				<p>high fives: {$highfiveCountStore}</p>
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	button {
		touch-action: manipulation;
	}
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
		display: flex;
		align-items: center;
		justify-content: center;
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
