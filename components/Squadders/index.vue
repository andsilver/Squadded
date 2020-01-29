<template>
	<div v-if="users" class="squadders-users">
		<div class="left-sec">
			<div>
				<div
					v-for="(user, index) in first5Users"
					:key="user._id"
					:style="{left: getPosition(index), 'z-index': 99 + index}"
					class="user-avatar-container"
				>
					<img :src="user.avatar" alt>
				</div>
				<Button
					ref="expand-button"
					class="expand hide-section"
					:style="{left: getMorePosition(), 'z-index': 106}"
				>
					<v-icon
						size="4.30vw"
					>
						sqdi-more-2
					</v-icon>
				</Button>
				<h4 v-if="isMoreThan7" ref="count-squadders" :style="{left: getMorePosition(), 'z-index': 110}" class="count-squadders">
					{{ "+" + countSquadders }}
				</h4>
			</div>
		</div>
	</div>
</template>
<script>
import Button from '~/components/common/Button';

export default {
	components: {
		Button,
	},
	props: {
		users: {
			type: Array,
			required: true,
		},
	},
	computed: {
		first5Users() {
			return this.users && this.users.length
				? this.users.slice(0, 7)
				: [];
		},
		isMoreThan7() {
			return this.users && this.users.length > 7;
		},
		countSquadders() {
			return this.users && this.users.length
				? this.users.length
				: 0;
		},
	},
	methods: {
		getPosition(index) {
			return `${(9.48 - 1.69) * (index)}vw`;
		},
		getMorePosition() {
			return `${(9.48 - 1.69) * (this.users.length - 1)}vw`;
		},
		getCountPosition() {
			return `${(9.48 - 1.69) * (this.users.length + (this.isMoreThan7 ? 1 : 0)) + 2.98}vw`;
		},
	},
};
</script>

<style lang="stylus" scoped>
.hide-section
	display none
.squadders-users
	position relative
	height 9.92vw
	display flex
	margin-bottom 4vw
	.left-sec
		width 65vw
		position relative
		.count-squadders
			position absolute
			width 9.48vw
			height 9.48vw
			border-radius: 50%
			border 2px solid #fff
			background #000
			color #fff
			display flex
			align-items center
			justify-content center
			font-size 2.92vw

.user-avatar-container, .expand {
	position: absolute;
	top 0
	img {
		width: 9.48vw;
		height: 9.48vw;
		border-radius: 50%;
		border: 2px solid #fff;
	}
}

.expand {
	width: 9.48vw !important;
	height: 9.48vw !important;
	border-radius: 50%;
	padding: 0 !important;
	min-width: 9.48vw !important;
	border: 2px solid #fff;
	border-color #fff !important;
	&:before {
		content;
	}
}
</style>
