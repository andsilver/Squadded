<template>
	<section class="d-flex align-center">
		<UserLink
			size="30"
			:user="notification.author"
		/>
		<span>
			&nbsp;{{ $t('notify.like') }}
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
