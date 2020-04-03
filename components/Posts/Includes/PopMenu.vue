<template>
	<div class="popup-menu-sec">
		<v-menu
			v-model="menu"
			:attach="parentNode"
			absolute
			origin="right top"
			transition="scale-transition"
			class="comment-settings"
		>
			<template v-slot:activator="{ on }">
				<v-btn icon class="button_more" :loading="!!deleteTimeout" v-on="on">
					<v-icon>
						sqdi-more
					</v-icon>
				</v-btn>
			</template>

			<v-list class="comment-setting-options two_settings_options">
				<v-list-item ref="close" class="comment-menu-action comment-setting-option">
					<v-list-item-title class="setting-label action">
						{{ $t(`comment.pop.Action`) }}
						<v-btn icon height="30px" class="button_more" @click="menu = false">
							<v-icon>
								sqdi-more
							</v-icon>
						</v-btn>
					</v-list-item-title>
				</v-list-item>
				<v-list-item ref="sharelink" class="post-menu-share comment-menu-share comment-setting-option" @click="share">
					<v-list-item-title class="setting-label share">
						{{ $t(`post.pop.sharelink.menu`) }}
					</v-list-item-title>
				</v-list-item>
				<template v-if="post.byMe">
					<v-list-item ref="toggle" class="post-menu-edit comment-menu-privpub comment-setting-option" @click="togglePrivate">
						<v-list-item-title class="setting-label" :class="{ public: post.private, private: !post.private }">
							{{ $t(`post.pop.${ post.private ? 'setPublic' : 'setPrivate' }.menu`) }}
						</v-list-item-title>
					</v-list-item>
					<v-list-item class="post-menu-share comment-menu-edit comment-setting-option">
						<v-list-item-title ref="edit" class="setting-label edit" @click="editPost">
							{{ $t(`post.pop.edit.menu`) }}
						</v-list-item-title>
					</v-list-item>
					<v-list-item class="post-menu-edit comment-menu-delete comment-setting-option">
						<v-list-item-title ref="delete" class="setting-label delete" @click="promptDelete">
							{{ $t(`post.pop.deletePost.menu`) }}
						</v-list-item-title>
					</v-list-item>
				</template>
				<template v-else>
					<v-list-item class="post-menu-report comment-menu-report comment-setting-option">
						<v-list-item-title ref="report" class="setting-label report" @click="promptReportPost">
							{{ $t(`post.pop.reportPost.menu`) }}
						</v-list-item-title>
					</v-list-item>
					<v-list-item
						v-if="!post.user.mysquad"
						ref="add"
						class="post-menu-share comment-menu-addtomysquad comment-setting-option"
						@click="invite"
					>
						<v-list-item-title class="setting-label addtomysquad">
							{{ $t(`post.addToMySquad`, { user: post.user.screenName }) }}
						</v-list-item-title>
					</v-list-item>
					<v-list-item
						v-else
						ref="remove"
						class="post-menu-share comment-menu-rmtomysquad comment-setting-option"
						@click="removeSquad"
					>
						<v-list-item-title class="setting-label rmtomysquad">
							{{ $t(`post.removeUser`, { user: post.user.screenName }) }}
						</v-list-item-title>
						<RemoveSquadBtn v-show="false" ref="remove-squad" :user="post.user" />
					</v-list-item>
				</template>
			</v-list>
		</v-menu>
		<v-dialog v-model="showShare">
			<SharePost ref="share-post-modal" :post-link="shortURL" />
		</v-dialog>

		<v-dialog v-model="showReasonDialog" content-class="report-dialog">
			<v-card>
				<v-card-title class="card-title">
					{{ $t('post.pop.reportPost.question') }}
					<v-btn ref="close-icon-btn-report-dialog" icon class="close-dialog" @click="hide">
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
					<Button ref="report-btn" class="flex-grow-1" :disabled="disabled" @click.native="reportPost">
						{{ $t('comment.pop.reportComment.menu') }}
					</Button>
					<Button ref="close-btn-report-dialog" class="flex-grow-1" :active="false" @click.native="hide">
						{{ $t('Cancel') }}
					</Button>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog v-model="showDeleteDialog" content-class="report-dialog delete-dialog">
			<v-card>
				<v-card-title class="card-title">
					{{ $t('post.pop.deletePost.question') }}
					<v-btn icon class="close-dialog" @click.native="hide">
						<v-icon size="3.69vw">
							sqdi-close-cross
						</v-icon>
					</v-btn>
				</v-card-title>
				<v-card-text class="report-options">
					<span class="delete-text">{{ $t('post.pop.deletePost.description') }}</span>
				</v-card-text>
				<v-card-actions class="d-flex justify-center card-action">
					<Button ref="delete-post-btn" class="flex-grow-1 delete-button" @click.native="deletePost">
						{{ $t('post.pop.deletePost.menu') }}
					</Button>
					<Button class="flex-grow-1" :active="false" @click.native="editPost">
						{{ $t('post.pop.deletePost.decline') }}
					</Button>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import SharePost from './SharePost';
import Button from '~/components/common/Button';
import RemoveSquadBtn from '~/components/common/RemoveSquad';
import { PostStore, PostActions } from '~/store/post';
import { FeedMutations, FeedStore } from '~/store/feed';
import { HomeStore, HomeMutations } from '~/store/home';
import { ActivityStore, ActivityMutations } from '~/store/activity';
import { PairedItemStore, PairedItemMutations } from '~/store/paired-item';
import { NotificationStore, NotificationMutations } from '~/store/notification';
import { BANNER_TIMEOUT } from '~/consts';
import { getShortURL } from '~/services/short-url';

const CANCELED_BY_USER = 20;

export default {
	components: {
		Button,
		SharePost,
		RemoveSquadBtn,
	},
	props: {
		post: {
			type: Object,
			required: true,
		},
	},
	data: () => ({
		current: null,
		parentNode: null,
		showShare: false,
		menu: false,
		reason: null,
		reasons: [
			'notInteresting',
			'spam',
			'inappropriate',
			'other',
		],
		other: null,
		showReasonDialog: false,
		showDeleteDialog: false,
		deleteTimeout: null,
		privacyTimeout: null,
		undoDeleteWatch: null,
		undoPrivacyWatch: null,
		shortURL: null,
	}),
	computed: {
		currentText () {
			return this.current ? {
				question: this.$t(`post.pop.${this.current}.question`),
				description: this.$t(`post.pop.${this.current}.description`),
				decline: this.$t(`post.pop.${this.current}.decline`),
			} : {};
		},
		disabled() {
			return !this.reason || (this.reason === 'other' && !this.other);
		},
		target () {
			const { siteUrl, siteTitle } = this.$store.state.merchant;
			return {
				id: this.post.guid,
				url: siteUrl,
				title: siteTitle,
			};
		},
		postLink () {
			const { API_ENDPOINT } = this.$store.state.squad;
			const target = JSON.stringify(this.target);
			return `${API_ENDPOINT}/community/post?t=${btoa(target)}`;
		},
		...mapState([
			'socket',
		]),
	},
	mounted () {
		this.parentNode = this.$parent.$el;
	},
	methods: {
		hide () {
			this.current = null;
			this.showReasonDialog = false;
			this.showDeleteDialog = false;
		},
		confirm () {
			this[this.current]();
			this.hide();
		},
		deletePost () {
			const clear = () => {
				this.deleteTimeout && clearTimeout(this.deleteTimeout);
				this.deleteTimeout = null;
				this.undoDeleteWatch && this.undoDeleteWatch();
				this.undoDeleteWatch = null;
			};

			clear();

			this.deleteTimeout = setTimeout(() => {
				const { postId } = this.post;
				this.$ws.sendObj({
					type: 'deletePost',
					postId,
				});
				this.$store.commit(`${FeedStore}/${FeedMutations.removePost}`, postId);
				this.$store.commit(`${HomeStore}/${HomeMutations.removePost}`, postId);
				this.$store.commit(`${ActivityStore}/${ActivityMutations.removePost}`, postId);
				clear();
			}, BANNER_TIMEOUT);

			this.undoDeleteWatch = this.$store.subscribe((mutation) => {
				const { type, payload } = mutation;
				if (
					type !== `${NotificationStore}/${NotificationMutations.undo}` ||
					payload.type !== 'post' ||
					payload.postId !== this.post.postId
				) {
					return;
				}
				clear();
			});

			const message = {
				type: 'notifAlert',
				alertType: 'checkmark',
				text: this.$t('postdeleted'),
				post: this.post,
				ts: Date.now(),
				_id: Date.now(),
			};
			this.$store.commit(
				`${NotificationStore}/${NotificationMutations.add}`,
				message,
			);
			this.hide();
		},
		reportPost () {
			const { postId } = this.post;
			this.$store.dispatch(`${PostStore}/${PostActions.reportPost}`, {
				post: this.post,
				reason: this.reason,
				other: this.other,
			});
			this.$store.commit(`${FeedStore}/${FeedMutations.removePost}`, postId);
			this.$store.commit(`${HomeStore}/${HomeMutations.removePost}`, postId);
			this.$store.commit(`${ActivityStore}/${ActivityMutations.removePost}`, postId);
			this.$store.commit(`${PairedItemStore}/${PairedItemMutations.removePost}`, postId);
			this.hide();
		},
		togglePrivate () {
			const clear = () => {
				this.privacyTimeout && clearTimeout(this.privacyTimeout);
				this.privacyTimeout = null;
				this.undoPrivacyWatch && this.undoPrivacyWatch();
				this.undoPrivacyWatch = null;
			};

			clear();

			this.privacyTimeout = setTimeout(() => {
				this.$store.dispatch(`${PostStore}/${PostActions.updatePrivate}`, { post: this.post, private: !this.post.private });
				clear();
			}, BANNER_TIMEOUT);

			this.undoPrivacyWatch = this.$store.subscribe((mutation) => {
				const { type, payload } = mutation;
				if (
					type !== `${NotificationStore}/${NotificationMutations.undo}` ||
					payload.type !== 'privacy' ||
					payload.postId !== this.post.postId
				) {
					return;
				}
				clear();
			});

			const message = {
				type: 'notifAlert',
				alertType: this.post.private ? 'setpublic' : 'setprivate',
				text: this.post.private ? 'Anyone can see your post now' : 'Only your followers can see your post now',
				post: this.post,
				ts: Date.now(),
				_id: Date.now(),
			};

			this.$store.commit(
				`${NotificationStore}/${NotificationMutations.add}`,
				message,
			);
		},
		promptDelete () {
			this.showDeleteDialog = true;
		},
		promptReportPost() {
			this.current = 'reportPost';
			this.reason = this.reasons[0];
			this.showReasonDialog = true;
		},
		async share() {
			this.showShare = false;
			if (!this.shortURL) {
				this.shortURL = await getShortURL(this.postLink, this.$store);
			}
			if (navigator && navigator.share) {
				const { siteTitle } = this.$store.state.merchant;
				try {
					await navigator.share({
						title: siteTitle,
						text: siteTitle,
						url: this.shortURL,
					});
				} catch (error) {
					if (error.code !== CANCELED_BY_USER) {
						this.showModal();
					}
				}
			} else {
				this.showModal();
			}
		},
		showModal () {
			this.showShare = true;
		},
		editPost () {
			this.current = null;
			this.showReasonDialog = false;
			this.showDeleteDialog = false;
			this.menu = false;
			this.$emit('edit');
		},
		removeSquad () {
			this.$refs['remove-squad'].$refs['remove-trigger'].$el.click();
		},
		invite () {
			if (!this.socket.isAuth) {
				return this.$router.push('/');
			}
			this.$ws.sendObj({
				type: 'inviteSquad',
				targetUserId: this.post.user.guid || this.post.user.userId,
			});
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
	top 0px !important
	left auto !important
	right 0
	border-radius 0
	box-shadow 0px 0.92vw 6.153vw rgba(0,0,0,0.15)
.comment-setting-options
	padding-top 2.95vw
	&.two_settings_options
		.setting-label
			margin-bottom 0
			border-bottom 0.46vw solid rgba(184,184,186,0.3)
			padding-bottom 3.8vw
			padding-top 3.8vw
			font-size 3.38vw
		.comment-setting-option:last-child .setting-label, .comment-setting-option:first-child .setting-label
			margin-bottom 0
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
				background-image url('~assets/img/action-user-remove.svg')
				padding-left 6.73vw
				background-position-y center
			&.unwatch
				background-size 3.84vw
				background-image url('~assets/img/action-unwatch.svg')
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
