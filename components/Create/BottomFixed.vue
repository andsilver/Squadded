<template>
	<div class="bottom-fix">
		<slot />
	</div>
</template>

<style lang="stylus" scoped>
.bottom-fix
	position fixed
	background-color: #fff
	bottom 0
	padding 3.46vw 0 6.15vw
	left 0
	right 0
	z-index 200
</style>
