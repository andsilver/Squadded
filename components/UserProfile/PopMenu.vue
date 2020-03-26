<template>
	<div>
		<v-menu
			v-model="menu"
			:attach="parentNode"
			absolute
			origin="right top"
			transition="scale-transition"
			class="comment-settings"
		>
			<template v-slot:activator="{ on }">
				<v-btn icon class="button_more" v-on="on">
					<v-icon>
						sqdi-more
					</v-icon>
				</v-btn>
			</template>

			<v-list class="comment-setting-options two_settings_options">
				<v-list-item class="comment-menu-action comment-setting-option">
					<v-list-item-title class="setting-label action">
						{{ $t(`user.action.Action`) }}
						<v-btn icon class="button_more" @click="menu = false">
							<v-icon>
								sqdi-more
							</v-icon>
						</v-btn>
					</v-list-item-title>
				</v-list-item>
				<!-- <v-list-item class="comment-menu-pushwatchers comment-setting-option">
					<v-list-item-title class="setting-label pushwatchers">
						{{ $t(`user.action.PushWatchers`) }}
					</v-list-item-title>
				</v-list-item> -->
				<v-list-item class="comment-menu-report comment-setting-option">
					<v-list-item-title ref="report" class="setting-label report" @click="promptReportUser">
						{{ $t(`user.action.report`) }}
					</v-list-item-title>
				</v-list-item>
				<v-list-item
					v-if="!isMysquad && !isPending"
					ref="add-to-squad"
					class="comment-menu-addtomysquad comment-setting-option"
					@click="addToSquad"
				>
					<v-list-item-title class="setting-label addtomysquad">
						{{ $t(`user.action.AddMySquad`) }}
					</v-list-item-title>
				</v-list-item>
				<v-list-item
					v-if="isMysquad"
					ref="remove-squad"
					class="comment-menu-addtomysquad comment-setting-option"
					@click="removeSquad"
				>
					<v-list-item-title class="setting-label rmtomysquad">
						{{ $t(`user.action.Remove`) }}
					</v-list-item-title>
				</v-list-item>
				<!-- <v-list-item
					v-if="!isMysquad && user.followers.me"
					ref="unwatch"
					class="comment-menu-unwatch comment-setting-option"
					@click="toggleFollow"
				>
					<v-list-item-title class="setting-label unwatch">
						{{ $t(`user.action.Unwatch`) }}
					</v-list-item-title>
				</v-list-item>
				<v-list-item
					v-if="!isMysquad && !user.followers.me"
					ref="watch"
					class="comment-menu-unwatch comment-setting-option"
					@click="toggleFollow"
				>
					<v-list-item-title class="setting-label">
						<v-icon small color="black">
							mdi-eye-outline
						</v-icon>
						<span class="ml-1">
							{{ $t(`user.Follow`) }}
						</span>
					</v-list-item-title>
				</v-list-item> -->
				<!-- <v-list-item class="comment-menu-rmtomysquad comment-setting-option">
					<v-list-item-title class="setting-label rmtomysquad">
						{{ $t(`user.action.Block`) }}
					</v-list-item-title>
				</v-list-item> -->
				<v-list-item ref="share" class="post-menu-share comment-menu-share comment-setting-option" @click="share">
					<v-list-item-title class="setting-label share">
						{{ $t(`user.action.Sharelink`) }}
					</v-list-item-title>
				</v-list-item>
			</v-list>
		</v-menu>

		<Follow v-show="false" ref="follow" :user="user" />
		<RemoveSquad v-show="false" ref="remove" :user="user" />

		<v-dialog v-model="showReasonDialog" content-class="report-dialog">
			<v-card>
				<v-card-title class="card-title">
					{{ $t('user.action.reportUser') }}
					<v-btn icon class="close-dialog" @click.native="hide">
						<v-icon size="3.69vw">
							sqdi-close-cross
						</v-icon>
					</v-btn>
				</v-card-title>
				<v-card-text class="report-options">
					<v-radio-group v-model="reason">
						<v-radio v-for="r of reasons" :key="r" :label="$t(`comment.pop.reportComment.${r}`)" :value="r" color="#000" />
					</v-radio-group>
					<v-text-field
						v-if="reason === 'other'"
						v-model="other"
						hide-details
						solo
						flat
						class="pl-7 pt-0 mt-0 other-option"
						:label="$t('comment.pop.reportComment.whatiswrong')"
					/>
				</v-card-text>
				<v-card-actions class="d-flex justify-center card-action">
					<Button class="flex-grow-1" :disabled="disabled" @click.native="reportUser">
						{{ $t('comment.pop.reportComment.menu') }}
					</Button>
					<Button class="flex-grow-1" :active="false" @click.native="hide">
						{{ $t('Cancel') }}
					</Button>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog ref="share-dialog" v-model="showShare" content-class="share_box">
			<ShareProfile ref="share-profile-modal" :user-link="shortURL" @hideShowShare="hideShare" />
		</v-dialog>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import Button from '~/components/common/Button';
import Follow from '~/components/common/Follow';
import RemoveSquad from '~/components/common/RemoveSquad';
import ShareProfile from '~/components/UserProfile/ShareProfile';
import { getShortURL } from '~/services/short-url';

const CANCALED_BY_USER = 20;

export default {
	components: {
		Button,
		Follow,
		RemoveSquad,
		ShareProfile,
	},
	props: {
		user: {
			type: Object,
			required: true,
		},
	},
	data: () => ({
		parentNode: null,
		menu: false,
		reason: null,
		reasons: [
			'spam',
			'inappropriate',
			'other',
		],
		other: null,
		showReasonDialog: false,
		showShare: false,
		shortURL: '',
	}),
	computed: {
		disabled() {
			return !this.reason || (this.reason === 'other' && !this.other);
		},
		isMysquad () {
			return this.user.squad && this.user.squad.exists && !this.user.squad.pending;
		},
		isPending() {
			return this.user && this.user.squad && this.user.squad.pending;
		},
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
		...mapState([
			'socket',
		]),
	},
	mounted() {
		this.parentNode = this.$parent.$el;
	},
	methods: {
		hide() {
			this.showReasonDialog = false;
		},
		reportUser() {
			if (!this.socket.isAuth) {
				return this.$router.push('/');
			}
			this.showReasonDialog = false;
			/**
			 * todo - see the same not about reporting User
			 */
		},
		promptReportUser() {
			this.reason = this.reasons[0];
			this.showReasonDialog = true;
		},
		toggleFollow () {
			if (!this.socket.isAuth) {
				return this.$router.push('/');
			}
			this.$refs.follow.toggleFollow();
		},
		addToSquad() {
			if (!this.socket.isAuth) {
				return this.$router.push('/');
			}
			this.$ws.sendObj({
				type: 'acceptSquad',
				targetUserId: this.user.userId,
			});
		},
		removeSquad () {
			this.$refs.remove.removeSquad();
		},
		async share () {
			this.showShare = false;
			if (!this.shortURL) {
				this.shortURL = await getShortURL(this.userLink, this.$store);
			}
			if (navigator && navigator.share) {
				const { siteTitle } = this.$store.state.merchant;
				const title = `${this.user.name || this.user.screenName} @ ${siteTitle}`;
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
.popup-menu-sec
	align-self center
.button_more
	align-self center
	.v-icon
		color #B8B8BA
		font-size 18px
.v-dialog > .v-card > .v-card__title.card-title
	justify-content center
	font-size 4.30vw
	font-weight 700
	position relative
	.close-dialog
		position absolute
		right 15px
.card-action
	padding 6.15vw 4.53vw
	.v-btn
		height 12.30vw
		font-size 2.61vw
		+.v-btn
			margin-left 3.07vw !important
			background-color #fff !important
			border 0.461vw solid #000
.v-menu__content
	width 55.38vw
	top -8px !important
	left auto !important
	right 0
	border-radius 0
	box-shadow 0px 0.92vw 6.153vw rgba(0,0,0,0.15)
.comment-setting-options
	padding-top 2.95vw
	padding-bottom 3.32vw
	&.two_settings_options
		.setting-label
			margin-bottom 0
			border-bottom 0.46vw solid rgba(184,184,186,0.3)
			padding-bottom 3.8vw
			padding-top 3.8vw
			font-size 3.38vw
		.comment-setting-option:last-child .setting-label, .comment-setting-option:first-child .setting-label
			margin-bottom 0
			padding-bottom 0
			border-bottom 0px;
	.comment-setting-option
		padding 0 4.53vw
		font-size 3.38vw
		font-weight 700
		cursor pointer
		.setting-label
			&.report
				background-image url('~assets/img/report.svg')
				padding-left 6.73vw
				background-size 4.15vw
				background-position-y center
			&.delete
				background-size 3vw
				background-image url('~assets/img/delete.svg')
				padding-left 6.73vw
				background-position-y 16px !important
				background-position-x 2px
			&.public
				background-size 3.84vw
				background-image url('~assets/img/action-public.svg')
				padding-left 6.73vw
				background-position-y center
			&.private
				background-size 3.84vw
				background-image url('~assets/img/action-private.svg')
				padding-left 6.73vw
				background-position-y center
			&.share
				background-size 3.84vw
				background-image url('~assets/img/action-share.svg')
				padding-left 6.73vw
				background-position-y center
			&.edit
				background-size 3.84vw
				background-image url('~assets/img/action-edit.svg')
				padding-left 6.73vw
				background-position-y center
			&.addtomysquad
				background-size 3.84vw
				background-image url('~assets/img/action-add-user.svg')
				padding-left 6.73vw
				background-position-y center
			&.rmtomysquad
				background-size 3.84vw
				background-image url('~assets/img/block-shophie.svg')
				padding-left 6.73vw
				background-position-y center
			&.pushwatchers
				background-size 3.84vw
				background-image url('~assets/img/push-watchers.svg')
				padding-left 6.73vw
				background-position-y center
			&.unwatch
				background-size 3.84vw
				background-image url('~assets/img/action-unwatch.svg')
				padding-left 6.73vw
				background-position-y center
			&.watch
				background-size 3.84vw
				background-image url('~assets/img/eye.svg')
				padding-left 6.73vw
				background-position-y center

		&.comment-menu-action
			font-weight 400
			color #b8b8ba !important
			margin-bottom 2vw
			padding-right 0
			.setting-label.action
				display flex
				justify-content space-between
				align-items center
				padding-top 0
	.comment-setting-option:last-child .setting-label
		background-position-y 14px
.grouped-post .v-menu__content
	right 12px
span.delete-text
	font-size 3.69vw
	color #000
	line-height 4.92vw
	margin-top 4VW
	display block
	text-align center
.delete-button
	background-color #FD6256 !important
</style>
