<template>
	<nuxt-link ref="user-link" :to="getUserLink(voter)">
		<div class="d-flex align-center voter-section">
			<img v-if="voter && (voter.avatar || voter.miniAvatar)" ref="voter-avatar" :src="voter.avatar || voter.avatar" :alt="voter && voter.screenName">
			<img v-else ref="voter-avatar" class="dummy_image pa-1" src="~assets/img/dummy_avater.svg" :alt="voter && voter.screenName">
			<h5>
				{{ voter.screenName }}
			</h5>
		</div>
	</nuxt-link>
</template>

<script>
export default {
	props: {
		voter: {
			type: Object,
			required: true,
		},
	},
	methods: {
		getUserLink(voter) {
			if (voter && voter.userId) {
				return { name: 'user-id', params: { id: voter.userId } };
			}
		},
	},
};
</script>

<style lang="stylus" scoped>
.voter-section
	padding 0 4.61vw
	margin-bottom 3.07vw
	img
		width 7.69vw
		height 7.69vw
		border-radius 50%
	h5
		font-size 3.07vw
		margin-left 3.13vw
</style>
