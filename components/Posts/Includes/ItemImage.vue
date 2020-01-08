<template>
	<v-img
		:key="item.img"
		:src="item.img"
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
	height 42vh
.photo-create .photo-view .v-image
	height 60.95vw
.paired-section .poll-item .v-image, .paired-section .outfit-card .v-image
	min-height 101px
.paired-section .gallery-card .multi-item .v-image
	height 65.76vw

</style>
