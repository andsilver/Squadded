<template>
	<v-img
		:src="item.img"
		eager
		@click="() => $emit('open')"
	>
		<slot />
		<ReSquaddButton
			v-if="resquadd && !isPaired"
			class="reSquaddButton"
			:item="item"
		/>
	</v-img>
</template>

<script>
import ReSquaddButton from '~/components/ReSquaddButton';

export default {
	components: {
		ReSquaddButton,
	},
	props: {
		item: {
			type: Object,
			required: true,
		},
		resquadd: {
			type: Boolean,
			default: true,
		},
		isPaired: {
			type: Boolean,
			default: false,
		},
	},
};
</script>

<style lang="stylus" scoped>
.gallery-card .multi-item .v-image
	height 100.384vw

.photo-create .multi-item .v-image
	height 30vh
.photo-create .photo-view .v-image
	height 60.95vw
.paired_section .poll-item .v-image, .paired_section .outfit-card .v-image
	min-height 101px
.paired_section .gallery-card .multi-item .v-image
	height 65.76vw
.grouped-post .v-image:after
	transition background-color linear .2s
	background-color rgba(255,255,255,0.6)
	content ''
	width 100%
.grouped-post .is_selected .v-image:after
	background-color transparent
.single-post .v-image:after
	transition background-color linear .2s
	background-color rgba(255,255,255,0.0)
	content ''
	width 100%

</style>
