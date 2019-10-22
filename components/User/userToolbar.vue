<template>
	<section>
		<button class="button_more icon-more" />
		<button class="button_add_user icon-add-user" />
		<button class="button_bag icon-shopping-bag">
			<div class="shopping_bag_count">
				<span>1</span>
			</div>
		</button>
		<span>Profile</span>
	</section>
</template>

<script>
export default {
};
</script>

<style scoped>
	section {
		display: flex;
		position: relative;
		justify-content: space-between;
		background-color: white;
	}

	button {
		width: 10.5%;
		z-index: 2;
		padding: 2% 2%;
		font-size: 1.3em;
	}

	.button_add_user {
		margin-left: auto;
	}

	span {
		position: absolute;
		width: 100%;
		height: 100%;

		padding-top: 2%;
		left: 0;
		text-align: center;

		font-weight: 700;
	}

	.shopping_bag_count {
		position: absolute;

		bottom: 0;
		right: 4px;

		width: 14px;
		height: 14px;
		font-size: 10px;
		line-height: 12px;

		color: #fff;
		background-color: orangered;
		border-radius: 50%;
	}
</style>
