<template>
	<div class="squadders-users">
		<div class="left-sec">
			<div>
				<div
					v-for="(user, index) in first5Users"
					:key="user._id"
					:style="{left: getPosition(index), 'z-index': 2 + index}"
					class="user-avatar-container"
				>
					<img :src="user.avatar" alt>
				</div>
				<div class="count-squadders d-flex align-center" :style="{left: getCountPosition()}">
					<Button ref="plus-btn" class="plus-btn">
						<v-icon small>
							mdi-account-plus
						</v-icon>
					</Button>
					<h4 v-if="isMoreThan5" ref="count-squadders" class="ml-2">
						{{ "+" + (countSquadders - 5) }}
					</h4>
				</div>
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
				? this.users.slice(0, 5)
				: [];
		},
		isMoreThan5() {
			return this.users && this.users.length > 5;
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
		getCountPosition() {
			return `${(9.48 - 1.69) * (this.isMoreThan5 ? 5 : this.countSquadders)}vw`;
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
			z-index 9
			position absolute

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

.plus-btn
	width: 9.48vw !important
	height: 9.48vw !important
	border-radius: 50%
	padding: 0 !important
	min-width: 9.48vw !important
	border: 2px solid #fff
	border-color #fff !important

</style>
