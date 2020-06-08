<template>
	<section
		class="buttons d-flex align-center"
		height="40"
	>
		<Menu v-if="user.isMe" ref="menu" :dark="!isBgExist" small @edit="edit" />
		<GoBackBtn v-else ref="go-back-btn" :dark="!isBgExist" small />
		<div ref="screen-name" class="flex-grow-1 user-full-name" :class="{ is_me: user.isMe }">
			{{ user.name }}
		</div>
		<v-btn
			ref="share"
			icon
			:dark="isBgExist"
			class="hide-sec"
			color="black"
			@click="share"
		>
			<v-icon>
				sqdi-share
			</v-icon>
		</v-btn>
		<AddFriendsButton
			v-if="user.isMe"
			ref="add-user-btn"
			class="profile-add-user"
			:dark="false"
		/>
		<v-btn
			v-if="user.isMe"
			ref="shop-btn"
			class="profile-shopping-bag"
			icon
			:dark="isBgExist"
			color="black"
		>
			<v-icon small>
				sqdi-shopping-bag
			</v-icon>
			<!-- <span class="shopping_bag_count">4</span> -->
		</v-btn>
		<Actions v-else :user="user" />
		<span
			v-if="!isBgExist"
			ref="profile-title"
			class="profile_title"
		>
			{{ $t('Profile') }}
		</span>

		<v-dialog v-model="showShare" content-class="share_box">
			<ShareProfile ref="share-profile-modal" :user-link="shortURL" @hideShowShare="hideShare" />
		</v-dialog>
	</section>
</template>

<script>
import { Base64 } from 'js-base64';
import Menu from './Menu';
import ShareProfile from './ShareProfile';
import Actions from './Actions';
import GoBackBtn from '~/components/common/GoBackBtn';
import { getShortURL } from '~/services/short-url';
import AddFriendsButton from '~/components/common/AddFriendsButton';

const CANCALED_BY_USER = 20;

export default {
	components: {
		Menu,
		GoBackBtn,
		ShareProfile,
		Actions,
		AddFriendsButton,
	},
	props: {
		user: {
			type: Object,
			required: true,
		},
	},
	data: () => ({
		isBgExist: true,
		showShare: false,
		shortURL: '',
	}),
	computed: {
		target () {
			const { siteUrl, siteTitle } = this.$store.state.merchant;
			return {
				id: this.user.userId,
				url: siteUrl,
				title: siteTitle,
			};
		},
		userLink () {
			const { API_ENDPOINT } = this.$store.state.squad;
			const target = JSON.stringify(this.target);
			return `${API_ENDPOINT}/community/profile?t=${Base64.encode(target)}`;
		},
	},
	methods: {
		async share () {
			this.showShare = false;
			if (!this.shortURL) {
				this.shortURL = await getShortURL(this.userLink, this.$store);
			}
			if (navigator && navigator.share) {
				const { siteTitle } = this.$store.state.merchant;
				const title = `${this.user.name} @ ${siteTitle}`;
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
		edit () {
			this.$router.push('/profile-settings');
		},
		hideShare () {
			this.showShare = false;
		},
	},
};
</script>

<style lang="stylus" scoped>
	.hide-sec
		display none
	.buttons
		position relative

	.shopping_bag_count
		position absolute

		bottom -6px
		right 2px

		width 14px
		height 14px
		font-size 9px
		line-height 14px

		background-color #FD6256
		border-radius 50%
		font-weight 900

	.buttons
		width 100%

	.profile_title
		position: absolute
		width 100%
		height 40px
		line-height 40px
		text-align center
		font-weight 700
		font-size .85em
	.flex-grow-1.user-full-name
		align-self center
		display flex
		justify-content center
		font-size 4.30vw
		color black
		font-weight 700
		&.is_me
			padding-left 40px
.profile-shopping-bag
	.sqdi-shopping-bag
		font-size 6.46vw !important
</style>
