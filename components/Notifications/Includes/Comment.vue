<template>
	<section class="d-flex">
		<UserLink
			size="40"
			:user="notification.user"
			hide-name
		/>
		<div class="d-flex flex-column justify-center">
			<span>
				<UserLink
					size="30"
					:user="notification.user"
					hide-avatar
				/>
				&nbsp;{{ $t('notify.comment') }}
				<b>
					&nbsp;{{ notification.post.text || $t('notify.post') }}
				</b>
			</span>
			<span v-if="!banner">
				<v-avatar color="#000" size="24px">
					<v-icon dark size="16">
						sqdi-chat-outlined
					</v-icon>
				</v-avatar>
				{{ timeString }}
			</span>
		</div>
	</section>
</template>

<script>
import UserLink from '~/components/UserLink';

export default {
	name: 'NotifyComment',
	components: {
		UserLink,
	},
	props: {
		notification: {
			type: Object,
			required: true,
		},
		banner: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		timeString () {
			window.moment.locale(this._i18n.locale);
			return window.moment(this.notification.ts).fromNow();
		},
	},
};
</script>

<style lang="stylus" scoped>
</style>
