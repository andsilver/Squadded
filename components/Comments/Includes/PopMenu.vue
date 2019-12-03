<template>
	<v-menu :attach="parentNode" bottom offset-y left>
		<template v-slot:activator="{ on }">
			<v-btn icon class="button_more" v-on="on">
				<v-icon>
					sqdi-more
				</v-icon>
			</v-btn>
		</template>

		<v-list>
			<v-list-item class="comment-menu-report">
				<v-list-item-title @click="promptReportComment">
					{{ $t(`comment.pop.reportComment.menu`) }}
				</v-list-item-title>
			</v-list-item>
		</v-list>
	</v-menu>
</template>

<script>

export default {
	props: {
		comment: {
			type: Object,
			required: true,
		},
	},
	data: () => ({
		current: null,
		parentNode: null,
	}),
	computed: {
		currentText () {
			return this.current ? {
				question: this.$t(`comment.pop.${this.current}.question`),
				description: this.$t(`comment.pop.${this.current}.description`),
				decline: this.$t(`comment.pop.${this.current}.decline`),
			} : {};
		},
	},
	mounted () {
		this.parentNode = this.$parent.$el;
	},
	methods: {
		hide () {
			this.current = null;
		},
		confirm () {
			this[this.current]();
			this.hide();
		},
		reportComment () {
			// todo - make sure, that identifier in Comment object is id, not commentId
			const { id: commentId } = this.comment;
			const { id: merchantId } = this.$store.state.merchant;
			const { userId } = this.$store.state.user.me;

			this.$ws.sendObj({
				type: 'report',
				commentId,
				merchantId,
				userId,
			});

			/**
                 * todo - see the same not about reporting Post
                 */
		},
		prompt () {
			this.$root.$emit('prompt', {
				text: this.currentText,
				hide: this.hide,
				confirm: this.confirm,
			});
		},
		promptReportComment() {
			this.current = 'reportComment';
			this.prompt();
		},
	},
};
</script>

<style lang="stylus" scoped>
    .button_more
        align-self center
        .v-icon
            color #B8B8BA
            font-size 18px
</style>
