<template>
	<section class="d-flex">
		<UserLink
			size="30"
			:user="notification.user"
		/>
		<span>
			&nbsp;{{ $t('notify.like') }}
			<b>
				&nbsp;{{ notification.post.text || $t('notify.post') }}
			</b>
		</span>
	</section>
</template>

<script>
import UserLink from '~/components/UserLink';

export default {
	name: 'NotifyLike',
	components: {
		UserLink,
	},
	props: {
		notification: {
			type: Object,
			required: true,
		},
	},
};
</script>

<style lang="stylus" scoped>
span
	padding-top 12px
</style>
