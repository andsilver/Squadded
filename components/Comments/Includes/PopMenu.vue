<template>
	<div>
		<v-menu :attach="parentNode" bottom offset-y left>
			<template v-slot:activator="{ on }">
				<v-btn icon height="30px" class="button_more" v-on="on">
					<v-icon>
						sqdi-more
					</v-icon>
				</v-btn>
			</template>

			<v-list>
				<v-list-item v-if="!comment.isMe" class="comment-menu-report">
					<v-list-item-title ref="report-comment" @click="promptReportComment">
						{{ $t(`comment.pop.reportComment.menu`) }}
					</v-list-item-title>
				</v-list-item>
				<v-list-item v-if="comment.isMe" class="comment-menu-delete">
					<v-list-item-title ref="delete-comment" @click="promptDeleteComment">
						{{ $t(`comment.pop.deleteComment.menu`) }}
					</v-list-item-title>
				</v-list-item>
			</v-list>
		</v-menu>

		<v-dialog v-model="showReasonDialog">
			<v-card>
				<v-card-title>
					{{ $t('comment.pop.reportComment.question') }}
				</v-card-title>
				<v-card-text>
					<v-radio-group v-model="reason">
						<v-radio v-for="r of reasons" :key="r" :label="$t(`comment.pop.reportComment.${r}`)" :value="r" />
					</v-radio-group>
					<v-text-field v-if="reason === 'other'" v-model="other" class="pl-6 pt-0 mt-0" :label="$t('comment.pop.reportComment.whatiswrong')" />
				</v-card-text>
				<v-card-actions class="d-flex justify-center">
					<Button class="flex-grow-1" :disabled="disabled" @click.native="prompt">
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
import { PostActions, PostStore, PostMutations } from '~/store/post';
import { NotificationStore, NotificationMutations } from '~/store/notification';

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
		reason: null,
		reasons: [
			'spam',
			'inappropriate',
			'other',
		],
		other: null,
		showReasonDialog: false,
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
			// todo - make sure, that identifier in Comment object is id, not commentId
			const { _id: commentId } = this.comment;
			const { id: merchantId } = this.$store.state.merchant;
			const { userId } = this.$store.state.user.me;

			this.$ws.sendObj({
				type: 'report',
				commentId,
				merchantId,
				userId,
				reason: this.reason,
				other: this.reason === 'other' ? this.other : null,
			});

			this.$store.commit(`${PostStore}/${PostMutations.deleteComment}`, {
				post: this.post,
				comment: this.comment,
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
			this.$store.dispatch(`${PostStore}/${PostActions.deleteComment}`, {
				post: this.post,
				comment: this.comment,
			});

			const message = {
				type: 'notifAlert',
				text: 'The comment has been deleted',
				ts: new Date(),
				_id: new Date(),
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
.button_more {
	.v-icon {
		color: #B8B8BA;
		font-size: 18px;
	}
}
</style>
