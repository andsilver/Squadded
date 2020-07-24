<template>
	<div>
		<div class="squadders-users px-3">
			<div class="left-sec">
				<div>
					<div
						v-for="(user, index) in first5Users"
						:key="index"
						:style="{left: getPosition(index), 'z-index': 2 + index}"
						class="user-avatar-container"
						@click="getUserLink(user)"
					>
						<div class="user-avatar-content">
							<img v-if="user.miniAvatar || user.avatar" :src="user.miniAvatar || user.avatar" alt>
							<div v-else ref="user-avatar" class="dummy_image" />
							<span class="user-name-hover">{{ user.screenName }}</span>
							<span v-if="index === 0 || user.online" class="online-status" />
						</div>
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
			<nuxt-link
				v-if="newRequests && newRequests.length"
				ref="new-requests"
				class="new-requests d-flex align-center text-center"
				to="/notifications/requests"
			>
				<span class="subtitle-2" style="color: #b8b8ba">New</span>
				<span class="new-requests-dot">{{ newRequests.length }}</span>
			</nuxt-link>
		</div>
		<div v-if="(first5Users.length < 2 || !hasPost) && !loading" class="mt-8 how-it-work-section">
			<v-divider />
			<div class="mt-10 d-flex flex-column align-center mb-4">
				<div class="text-center" style="font-weight: 600">
					{{ $t('feed.how_it_works.welcome') }}
				</div>
				<div class="text-center subtitle-1 font-weight-medium mb-4 how_it_work">
					{{ $t('feed.how_it_works.activities') }}
				</div>
				<div class="d-flex justify-center mb-6" style="position: relative">
					<img src="~assets/img/PhoneImage.png" width="45%">
					<img src="~assets/img/redo.svg" class="redo-icon">
				</div>
				<v-btn class="how-it-works-btn" outlined to="/walkthrough">
					{{ $t('feed.how_it_works.action') }}
				</v-btn>
			</div>
		</div>
		<div v-else class="mb-12" />
	</div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex';
import { UserStore } from '~/store/user';
import { NotificationStore } from '~/store/notification';
import AddFriendsButton from '~/components/common/AddFriendsButton';

const notifGetters = createNamespacedHelpers(NotificationStore).mapGetters;
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
		hasPost: {
			type: Boolean,
			required: true,
		},
	},
	data: () => ({
		userLink: '',
	}),
	computed: {
		...mapState([
			'me',
		]),
		...notifGetters(['newRequests']),
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
	z-index: 15
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

.user-avatar-content
	position relative

.plus-btn
	width: 36px !important
	height: 36px !important
	border-radius: 50%
	padding: 0 !important
	min-width: 36px !important
	border: 2px solid #fff
	border-color #fff !important

.how-it-works-btn {
	font-size: 0.52em !important;
	border-radius: 8px;
	border-width: 1.5px;
	font-weight: bold;
	height 34px
	padding: 0 24px !important;
}
.user-avatar-container:hover
	img
		width 43px
		height 43px
		transition all ease-in-out 0.25s;
		-webkit-transition all ease-in-out 0.25s;
		-ms-transition all ease-in-out 0.25s;
		transition all ease-in-out 0.25s;
		-webkit-transition all ease-in-out 0.25s;
		-ms-transition all ease-in-out 0.25s
		@media screen and (max-width: 280px)
			width 40px
			height 40px
	.user-name-hover
		display block
		text-align center
		font-size 10px
		margin-left -5px
		margin-top -5px
.online-status
	padding 5px
	border 2px solid white
	background #28f528
	border-radius 50%
	position absolute
	top 20px
	left -2px
	z-index 20
.walkthrough-squadders
	margin-bottom 12vw
	.count-squadders
		left: 7.5vw !important
	.how-it-work-section
		display none
.dummy_image
	background-image url('~assets/img/dummy_avater.svg')
	background-position center
	background-size 55%
	background-repeat no-repeat
	width: 36px;
	height: 36px;
	border-radius 50%
	border 0.92vw solid #fff
	background-color #F5F5F5
.new-requests
	position absolute
	right 10px
	top 14px
	margin-right 3px
	cursor pointer

	&-dot
		color white
		background #ee5f53
		font-size 10px
		width 15px
		height 15px
		border-radius 50%
		margin-left 4px
.how_it_work
	font-size 4.61vw !important
	padding 3vw 2.3vw 0
	line-height 1.5rem
	color #B8B8BA
.redo-icon
	width 40px
	transform rotate(45deg)
	position absolute
	right 10vw
</style>
