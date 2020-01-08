<template>
	<section
		class="buttons"
		height="40"
	>
		<Menu v-if="user.isMe" :dark="isBgExist" @share="share" @edit="edit" />
		<GoBackBtn v-else :dark="isBgExist" />
		<div class="flex-grow-1" />
		<v-btn
			v-if="!user.isMe"
			icon
			:dark="isBgExist"
			@click="share"
		>
			<v-icon>
				sqdi-share
			</v-icon>
		</v-btn>
		<v-btn
			icon
			:dark="isBgExist"
		>
			<v-icon>
				sqdi-add-user
			</v-icon>
		</v-btn>
		<v-btn
			icon
			:dark="isBgExist"
		>
			<v-icon>
				sqdi-shopping-bag
			</v-icon>
			<span class="shopping_bag_count">4</span>
		</v-btn>
		<span
			v-if="!isBgExist"
			class="profile_title"
		>
			{{ $t('Profile') }}
		</span>

		<v-dialog v-model="showShare">
			<ShareProfile :user-link="userLink" />
		</v-dialog>
	</section>
</template>

<script>
import Menu from './Menu';
import ShareProfile from './ShareProfile';
import GoBackBtn from '~/components/common/GoBackBtn';
const CANCALED_BY_USER = 20;

export default {
	components: {
		Menu,
		GoBackBtn,
		ShareProfile,
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
			return `${API_ENDPOINT}/community/profile?t=${btoa(target)}`;
		},
	},
	methods: {
		async share () {
			this.showShare = false;
			if (navigator && navigator.share) {
				const { siteTitle } = this.$store.state.merchant;
				const title = `${this.user.name} @ ${siteTitle}`;
				try {
					await navigator.share({
						title,
						text: title,
						url: this.userLink,
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
	},
};
</script>

<style lang="stylus" scoped>
	.buttons
		position relative
	.v-btn
		width 40px !important
		height 40px !important
		i
			font-size 1.5em !important

	.shopping_bag_count
		position absolute

		bottom -6px
		right 6px

		width 14px
		height 14px
		font-size 9px
		line-height 14px

		color #fff
		background-color #FD6256
		border-radius 50%
		font-weight 900

	.buttons
		display flex
		width 100%

	.profile_title
		position: absolute
		width 100%
		height 40px
		line-height 40px
		text-align center
		font-weight 700
		font-size .85em
</style>
