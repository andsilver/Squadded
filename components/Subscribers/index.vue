<template>
	<v-container class="my-squad">
		<BackBar />
		<v-tabs
			v-model="tabs"
			class="px-1 mt-2"
			fixed-tabs
			centered
		>
			<v-tab v-if="isMe" class="tabs bottom-line">
				<span style="text-transform: capitalize;">{{ $tc('user.MySquad') }}</span>
			</v-tab>
			<v-tab class="tabs bottom-line">
				<span style="text-transform: capitalize;">{{ $tc('user.Followers') }}</span>
			</v-tab>
			<v-tab class="tabs bottom-line">
				<span style="text-transform: capitalize;">{{ $tc('user.Following') }}</span>
			</v-tab>
		</v-tabs>
		<v-tabs-items v-model="tabs">
			<v-tab-item v-if="isMe" class="top-shadow">
				<MySquad />
			</v-tab-item>
			<v-tab-item class="top-shadow">
				<List type="fetchFollowers" />
			</v-tab-item>
			<v-tab-item class="top-shadow">
				<List type="fetchFollowing" />
			</v-tab-item>
		</v-tabs-items>
	</v-container>
</template>

<script>
import MySquad from './MySquad';
import BackBar from './BackBar';
import List from '~/components/Subscribers/List';

export default {
	name: 'Users',
	components: {
		BackBar,
		List,
		MySquad,
	},
	data: () => ({
		tabs: null,
		isMe: false,
	}),
	created () {
		const type = this.$route.name.split('-').slice(-1)[0];
		this.isMe = this.$route.path.includes('/my');
		if (type === 'mysquad') {
			this.tabs = 0;
		} else if (type === 'followers') {
			this.tabs = this.isMe ? 1 : 0;
		} else {
			this.tabs = this.isMe ? 2 : 1;
		}
	},
};
</script>
<style lang="stylus" scoped>
.tabs.bottom-line
	border-bottom 2px solid rgba(184,184,186,0.30)

.top-shadow
	position relative
	padding 0 12px
	margin-left -12px
	margin-right -12px
	&::before
		background -moz-linear-gradient(top,  rgba(218,217,221,0.3) 0%, rgba(255,255,255,0) 100%)
		background -webkit-linear-gradient(top,  rgba(218,217,221,0.3) 0%,rgba(255,255,255,0) 100%)
		background linear-gradient(to bottom,  rgba(218,217,221,0.3) 0%,rgba(255,255,255,0) 100%)
		height 4.615vw
		width 100%
		content ''
		left 0
		position absolute
		top 0px
		z-index 1

.v-slide-group__prev
	display none

.v-tab
	padding 0 !important
</style>
