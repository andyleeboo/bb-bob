<div class="bb-bob">
	<div class="face">
		<div class="eyes">
			<div class="eye" />
			<div class="eye" />
		</div>
		<div class="mouth" />
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
		justify-content: center;
		align-items: center;
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
	}
	.mouth {
		width: 30px;
		height: 50px;
		background: #222222;
	}
</style>
