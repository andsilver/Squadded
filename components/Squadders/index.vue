<template>
	<div class="squadders-users">
		<div class="left-sec">
			<div>
				<div
					v-for="(user, index) in first5Users"
					:key="index"
					:style="{left: getPosition(index), 'z-index': 2 + index}"
					class="user-avatar-container"
					@click="getUserLink(user)"
				>
					<img :src="user.miniAvatar || user.avatar" alt>
					<span class="user-name-hover">{{ user.screenName }}</span>
				</div>
				<div ref="share" class="count-squadders d-flex align-center" :style="{left: getCountPosition()}">
					<AddFriendsButton
						ref="plus-btn"
						color="white"
						:dark="true"
					/>
					<h4 v-if="isMoreThan5" ref="count-squadders" class="ml-1" @click="goToMySquad">
						{{ "+" + (countSquadders - 7) }}
					</h4>
				</div>
			</div>
		</div>
		<div v-if="first5Users.length < 2 && !loading" class="mt-2">
			<v-divider />
			<div class="mt-6 d-flex flex-column align-center">
				<div class="text-center subtitle-1 font-weight-medium mb-4">
					{{ $t('feed.how_it_works.text') }}
				</div>
				<v-btn class="how-it-works-btn" outlined to="/walkthrough">
					{{ $t('feed.how_it_works.action') }}
				</v-btn>
			</div>
		</div>
	</div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex';
import { UserStore } from '~/store/user';
import AddFriendsButton from '~/components/common/AddFriendsButton';

const { mapState } = createNamespacedHelpers(UserStore);
export default {
	components: {
		AddFriendsButton,
	},
	props: {
		users: {
			type: Array,
			required: true,
		},
		loading: {
			type: Boolean,
			default: false,
		},
	},
	data: () => ({
		userLink: '',
	}),
	computed: {
		...mapState([
			'me',
		]),
		first5Users() {
			return this.users && this.users.length
				? this.users.slice(0, 7)
				: [];
		},
		isMoreThan5() {
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
		getCountPosition() {
			return `${(9.48 - 1.69) * (this.isMoreThan5 ? 7 : this.countSquadders)}vw`;
		},
		getUserLink(user) {
			const userId = user.userId;
			const userLink = (userId === this.me.userId ? { name: 'me' }
				: { name: 'user-id', params: { id: userId } }
			);
			this.$router.push(userLink);
		},
		goToMySquad() {
			this.$router.push('/my/mysquad');
		},
	},
};
</script>

<style lang="stylus" scoped>
.hide-section
	display none

.squadders-users
	z-index: 1
	position fixed
	padding-bottom 2vw
	width 100%
	background #fff
	padding-top 2vw
	border-bottom 1px solid rgba(0,0,0,0.3)
	.left-sec
		height 36px
		position relative
		.count-squadders
			z-index 9
			position absolute
.user-avatar-container
	cursor pointer
.user-avatar-container, .expand
	position absolute
	top 0
	img
		width 36px
		height 36px
		border-radius 50%
		border 2px solid #fff
	.user-name-hover
		display none

.plus-btn
	width: 36px !important
	height: 36px !important
	border-radius: 50%
	padding: 0 !important
	min-width: 36px !important
	border: 2px solid #fff
	border-color #fff !important

.how-it-works-btn {
	font-size: 0.62em !important;
	border-radius: 10px;
	border-width: 2px;
	font-weight: bold;
	height: 40px;
	padding: 0 24px !important;
}
.user-avatar-container:hover
	img
		width 43px
		height 43px
		transition all ease-in-out 0.5s;
		-webkit-transition all ease-in-out 0.5s;
		-ms-transition all ease-in-out 0.5s;
		transition all ease-in-out 0.5s;
		-webkit-transition all ease-in-out 0.5s;
		-ms-transition all ease-in-out 0.5s
	.user-name-hover
		display block
		text-align center
		font-size 10px
		margin-left -5px
		margin-top -5px
</style>
