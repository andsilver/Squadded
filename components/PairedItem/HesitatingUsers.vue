<template>
	<div class="hesitating-users pa-2">
		<div>
			<h4 ref="hesitating-people-title">
				{{ $t('pairedItem.hesitating_users') }}
			</h4>
			<h4 ref="count-hesitating-people">
				{{ countHesitatingPeople }}
			</h4>
		</div>
		<div
			v-for="(user, index) in first5Users"
			:key="user._id"
			:style="{right: getPosition(index), 'z-index': 99 - index}"
			class="user-avatar-container"
		>
			<img :src="user.avatar" alt>
		</div>
		<Button v-if="isMoreThan5" ref="expand-button" class="expand-people">
			<v-icon>sqdi-more-2</v-icon>
		</Button>
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
			return `${8 + 32 * (index + (this.isMoreThan5 ? 1 : 0))}px`;
		},
	},
};
</script>

<style lang="stylus" scoped>
.hesitating-users {
	position: relative;
	height: 60px;
}

.user-avatar-container, .expand-people {
	position: absolute;
	top: 10px;

	img {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		border: 2px solid #fff;
	}
}

.expand-people {
	right: 8px;
	z-index: 99;
	width: 44px !important;
	height: 44px !important;
	border-radius: 50%;
	padding: 0 !important;
	min-width: 44px !important;

	&:before {
		content;
	}
}
</style>
