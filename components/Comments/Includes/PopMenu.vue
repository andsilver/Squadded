<template>
	<div>
		<v-menu
			v-model="menu"
			:attach="parentNode"
			absolute
			origin="right center"
			transition="scale-transition"
			class="comment-settings"
		>
			<template v-slot:activator="{ on }">
				<v-btn icon height="30px" class="button_more" v-on="on">
					<v-icon>
						sqdi-more
					</v-icon>
				</v-btn>
			</template>

			<v-list class="comment-setting-options" :class="{ two_settings_options: (!comment.byMe && postIsMine) }">
				<v-list-item class="comment-menu-action comment-setting-option">
					<v-list-item-title class="setting-label action">
						{{ $t(`comment.pop.Action`) }}
						<v-btn icon height="30px" class="button_more" @click="menu = false">
							<v-icon>
								sqdi-more
							</v-icon>
						</v-btn>
					</v-list-item-title>
				</v-list-item>
				<v-list-item v-if="!comment.byMe" class="comment-menu-report comment-setting-option">
					<v-list-item-title ref="report-comment" class="setting-label report" @click="promptReportComment">
						{{ $t(`comment.pop.reportComment.menu`) }}
					</v-list-item-title>
				</v-list-item>
				<v-list-item v-if="comment.byMe || postIsMine" class="comment-menu-delete comment-setting-option">
					<v-list-item-title ref="delete-comment" class="setting-label delete" @click="deleteComment">
						{{ $t(`comment.pop.deleteComment.menu`) }}
					</v-list-item-title>
				</v-list-item>
			</v-list>
		</v-menu>

		<v-dialog v-model="showReasonDialog" content-class="report-dialog">
			<v-card>
				<v-card-title class="card-title">
					{{ $t('comment.pop.reportComment.question') }}
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
					<Button class="flex-grow-1" :disabled="disabled" @click.native="reportComment">
						{{ $t('comment.pop.reportComment.menu') }}
					</Button>
					<Button class="flex-grow-1" :active="false" @click.native="hide">
						{{ $t('Cancel') }}
					</Button>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import Button from '~/components/common/Button';
import { PostActions, PostStore } from '~/store/post';
import { NotificationStore, NotificationMutations } from '~/store/notification';
import { BANNER_TIMEOUT } from '~/consts';

export default {
	components: {
		Button,
	},
	props: {
		comment: {
			type: Object,
			required: true,
		},
		post: {
			type: Object,
			required: true,
		},
	},
	data: () => ({
		current: null,
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
		deleteTimeout: null,
		undoWatch: null,
	}),
	computed: {
		currentText() {
			return this.current	? {
				question: this.$t(`comment.pop.${this.current}.question`),
				description: this.$t(`comment.pop.${this.current}.description`),
				decline: this.$t(`comment.pop.${this.current}.decline`),
			} : {};
		},
		disabled() {
			return !this.reason || (this.reason === 'other' && !this.other);
		},
		postIsMine() {
			const { userId } = this.$store.state.user.me;
			return userId === this.post.userId;
		},
	},
	mounted() {
		this.parentNode = this.$parent.$el;
	},
	methods: {
		hide() {
			this.current = null;
			this.showReasonDialog = false;
		},
		confirm() {
			this[this.current]();
			this.hide();
		},
		reportComment() {
			this.$store.dispatch(`${PostStore}/${PostActions.reportComment}`, {
				post: this.post,
				comment: this.comment,
				reason: this.reason,
				other: this.other,
			});

			const message = {
				type: 'notifAlert',
				text: 'The comment has been reported',
				ts: new Date(),
				_id: new Date(),
			};

			this.$store.commit(
				`${NotificationStore}/${NotificationMutations.add}`,
				message,
			);

			/**
			 * todo - see the same not about reporting Post
			 */
		},
		deleteComment() {
			const clear = () => {
				this.deleteTimeout && clearTimeout(this.deleteTimeout);
				this.deleteTimeout = null;
				this.undoWatch && this.undoWatch();
				this.undoWatch = null;
			};

			clear();

			this.deleteTimeout = setTimeout(() => {
				this.$store.dispatch(`${PostStore}/${PostActions.deleteComment}`, {
					post: this.post,
					comment: this.comment,
				});
				clear();
			}, BANNER_TIMEOUT);

			this.undoWatch = this.$store.subscribe((mutation) => {
				const { type, payload } = mutation;
				if (
					type !== `${NotificationStore}/${NotificationMutations.undo}` ||
					payload.type !== 'comment' ||
					payload.commentId !== this.comment._id
				) {
					return;
				}
				clear();
			});

			const message = {
				type: 'notifAlert',
				text: 'The comment has been deleted',
				comment: this.comment,
				ts: Date.now(),
				_id: Date.now(),
			};

			this.$store.commit(
				`${NotificationStore}/${NotificationMutations.add}`,
				message,
			);
		},
		prompt() {
			this.showReasonDialog = false;
			this.$root.$emit('prompt', {
				text: this.currentText,
				hide: this.hide,
				confirm: this.confirm,
			});
		},
		promptReportComment() {
			this.current = 'reportComment';
			this.reason = this.reasons[0];
			this.showReasonDialog = true;
		},
		promptDeleteComment() {
			this.current = 'deleteComment';
			this.prompt();
		},
	},
};
</script>

<style lang="stylus" scoped>
.button_more
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
	top -10px !important
	left auto !important
	right 0
	border-radius 0
	box-shadow 0px 0.92vw 6.153vw rgba(0,0,0,0.15)
.comment-setting-options
	padding-top 2.95vw
	padding-bottom 3.32vw
	&.two_settings_options
		.setting-label.report
			margin-bottom 2.92vw
			border-bottom 0.46vw solid rgba(184,184,186,0.3)
			padding-bottom 3.92vw
	.comment-setting-option
		padding 0 4.53vw
		font-size 3.38vw
		font-weight 700
		.setting-label
			&.report
				background-image url('~assets/img/report.svg')
				padding-left 5.73vw
				background-size 4.15vw
				background-position-y 0px
				font-size 3.38vw
			&.delete
				background-size 3vw
				background-image url('~assets/img/delete.svg')
				padding-left 5.73vw
				background-position-y center
				font-size 3.38vw
		&.comment-menu-action
			font-weight 400
			color #b8b8ba !important
			margin-bottom 5vw
			padding-right 0
			.setting-label.action
				display flex
				justify-content space-between
				align-items center
				font-size 3.38vw
.v-list-item
	cursor pointer
</style>
