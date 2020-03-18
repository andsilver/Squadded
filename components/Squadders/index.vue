<template>
	<div class="squadders-users">
		<div class="left-sec">
			<div>
				<div
					v-for="(user, index) in first5Users"
					:key="user._id"
					:style="{left: getPosition(index), 'z-index': 2 + index}"
					class="user-avatar-container"
					@click="goToMySquad"
				>
					<img :src="user.avatar" alt>
				</div>
				<div ref="share" class="count-squadders d-flex align-center" :style="{left: getCountPosition()}" @click="share">
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
		<v-dialog v-model="showShare" content-class="share_box">
			<ShareProfile ref="share-profile-modal" :user-link="shortURL" @hideShowShare="hideShare" />
		</v-dialog>
	</div>
</template>
<script>

import { createNamespacedHelpers } from 'vuex';
import ShareProfile from '~/components/UserProfile/ShareProfile';
import Button from '~/components/common/Button';
import { UserStore } from '~/store/user';
import { getShortURL } from '~/services/short-url';

const { mapState } = createNamespacedHelpers(UserStore);

const CANCALED_BY_USER = 20;

export default {
	components: {
		Button,
		ShareProfile,
	},
	props: {
		users: {
			type: Array,
			required: true,
		},
	},
	data: () => ({
		showShare: false,
		userLink: '',
		shortURL: '',
	}),
	computed: {
		...mapState([
			'me',
		]),
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
		target () {
			const { siteUrl, siteTitle } = this.$store.state.merchant;
			return {
				id: this.me.userId,
				url: siteUrl,
				title: siteTitle,
				invite: true,
			};
		},
	},
	methods: {
		getPosition(index) {
			return `${(9.48 - 1.69) * (index)}vw`;
		},
		getCountPosition() {
			return `${(9.48 - 1.69) * (this.isMoreThan5 ? 5 : this.countSquadders)}vw`;
		},
		goToMySquad() {
			this.$router.push('/my/mysquad');
		},
		async share () {
			const { API_ENDPOINT } = this.$store.state.squad;
			const target = JSON.stringify(this.target);
			this.userLink = `${API_ENDPOINT}/community/profile?t=${btoa(target)}`;
			this.showShare = false;
			if (!this.shortURL) {
				this.shortURL = await getShortURL(this.userLink, this.$store);
			}
			if (navigator && navigator.share) {
				const { siteTitle } = this.$store.state.merchant;
				const title = `${this.me.name || this.me.screenName} @ ${siteTitle}`;
				try {
					await navigator.share({
						title,
						text: title,
						url: this.shortURL,
					});
				} catch (error) {
					if (error.code !== CANCALED_BY_USER) {
						this.showModal();
					}
				}
			} else {
				this.showModal();
			}
		},
		showModal () {
			this.showShare = true;
			this.$forceUpdate();
		},
		hideShare () {
			this.showShare = false;
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
