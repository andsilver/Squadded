<template>
	<section>
		<button class="button_more sqdi-more" :class="{whiteText: isBgExist}" />
		<button class="button_add_user sqdi-add-user" :class="{whiteText: isBgExist}" />
		<button class="button_bag sqdi-shopping-bag" :class="{whiteText: isBgExist}">
			<div class="shopping_bag_count">
				<span>4</span>
			</div>
		</button>
		<span v-if="!isBgExist">Profile</span>
	</section>
</template>

<script>
export default {
	data: () => {
		return {
			isBgExist: true,
		};
	},
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

		font-weight: 900;
	}

	.whiteText {
		color: white;
	}

	.shopping_bag_count {
		position: absolute;

		bottom: 0;
		right: 4px;

		width: 12px;
		height: 12px;
		font-size: 8px;
		line-height: 12px;

		color: #fff;
		background-color: #FD6256;
		border-radius: 50%;
	}
</style>
