<template>
	<section class="d-flex align-center">
		<UserLink
			size="30"
			:user="notification.comment.author"
		/>
		<span>
			&nbsp;{{ $t('notify.comment') }}
		</span>
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
	},
};
</script>
