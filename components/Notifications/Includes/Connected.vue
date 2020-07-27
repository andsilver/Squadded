<template>
	<section class="d-flex align-center">
		<UserLink
			:size="'6.15vw'"
			:user="notification.user"
			hide-name
		/>
		<div class="notification-message d-flex align-center">
			<span class="user_name">
				{{ notification.user.screenName }}
			</span>
			<div class="notification-text">
				{{ $t('notify.squad_connected', { merchant: notification.merchantId }) }}
			</div>
		</div>
	</section>
</template>
<script>
import UserLink from '~/components/UserLink';

export default {
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
.notification-text
	font-size 3.230vw
	color #000
.notification-message
	width 100%
	cursor pointer
.user_name
	font-size 3.23vw
	font-weight 600
	line-height 4vw
</style>
