<template>
	<div>
		<div class="d-flex user-info">
			<userAvatar align="center" class="user-avatar mr-2" size="sm" :avatar="user.avatar" />
			<div>
				<userName :name="user.screenName" />
				<div class="to-you">
					{{ $t('signin.to_you') }}
				</div>
			</div>
		</div>
		<div class="user-invite-text pt-2 pb-6 pl-2 pr-2 mt-2">
			<div>
				{{ $t('Hi') }}!
			</div>
			<div ref="invite-text">
				{{ $t('user.invitation.invited_text') }}
			</div>
		</div>
	</div>
</template>

<script>
import userAvatar from '~/components/UserProfile/userAvatar';
import userName from '~/components/UserProfile/userName';

export default {
	components: {
		userAvatar,
		userName,
	},
	props: {
		user: {
			type: Object,
			required: true,
		},
	},
};
</script>

<style scoped lang="scss">
.user-info {
	.username {
		color: #1d1d1d;
		font-size: 12px;
		font-weight: 500;
	}

	.to-you {
		color: #717171;
		font-size: 10px;
	}
}

.user-invite-text {
	font-size: 12px;
	background: #efefef;
	border-radius: 8px;
	position: relative;

	::before {
		content: '';
		position: absolute;
		width: 0;
		height: 0;
		bottom: 98%;
		left: 6px;
		border: 10px solid transparent;
		border-top: none;
		border-bottom-color: #efefef;
	}
}
</style>
