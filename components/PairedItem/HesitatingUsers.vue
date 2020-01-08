<template>
	<div class="hesitating-users">
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
					v-if="isMoreThan5"
					ref="expand-button"
					class="expand-people"
					:style="{left: getMorePosition(), 'z-index': 106}"
				>
					<v-icon
						size="4.30vw"
					>
						sqdi-more-2
					</v-icon>
				</Button>
				<h4 ref="count-hesitating-people" :style="{left: getCountPosition()}" class="count-hesitating-people">
					{{ countHesitatingPeople }}
				</h4>
			</div>
		</div>
		<div class="right-sec">
			<h4 ref="hesitating-people-title" class="hesitating-people-title">
				{{ $t('pairedItem.hesitating_users') }}
			</h4>
		</div>
	</div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex';
import { PairedItemStore } from '~/store/paired-item';
import Button from '~/components/common/Button';

const { mapState } = createNamespacedHelpers(PairedItemStore);

export default {
	components: {
		Button,
	},
	computed: {
		...mapState(['hesitatingUsers']),
		first5Users() {
			return this.hesitatingUsers && this.hesitatingUsers.length
				? this.hesitatingUsers.slice(0, 5)
				: [];
		},
		isMoreThan5() {
			return this.hesitatingUsers && this.hesitatingUsers.length > 5;
		},
		countHesitatingPeople() {
			return this.hesitatingUsers && this.hesitatingUsers.length
				? this.hesitatingUsers.length
				: 0;
		},
	},
	methods: {
		getPosition(index) {
			return `${(9.48 - 1.69) * (index)}vw`;
		},
		getMorePosition() {
			return `${(9.48 - 1.69) * (this.hesitatingUsers.length)}vw`;
		},
		getCountPosition() {
			return `${(9.48 - 1.69) * (this.hesitatingUsers.length + (this.isMoreThan5 ? 1 : 0)) + 2.98}vw`;
		},
	},
};
</script>

<style lang="stylus" scoped>
.hesitating-users
	position relative
	height 9.92vw
	display flex
	margin 4vw 12px 1vw
	.left-sec
		width 70vw
		.count-hesitating-people
			position absolute
			top 7px
			padding-left 10px
			&::before
				content "+"
				position absolute
				left 0
	.right-sec
		.hesitating-people-title
			font-size 3.23vw
			line-height 4.30vw
			display flex
			align-items center

.user-avatar-container, .expand-people {
	position: absolute;
	top 0
	img {
		width: 9.48vw;
		height: 9.48vw;
		border-radius: 50%;
		border: 2px solid #fff;
	}
}

.expand-people {
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
