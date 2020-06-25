<template>
	<div class="d-flex mt-6 px-3">
		<userAvatar align="center" class="user_avatar mr-4" :avatar="user.avatar" />
		<div class="user-info-section">
			<userName :name="user.screenName" />
			<p class="mt-2 user-bio">
				{{ user.bio }}
			</p>
			<div ref="invite-text" class="invite-text text-center">
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

<style scoped>
.invite-text {
	background: #f5f5f5;
	padding: 10px 12px;
	color: black;
	font-size: 12px;
	font-weight: 600;
	border-radius: 16px;
}
.user-info-section {
	margin-top: 1.33vw;
}
.user-bio {
    font-size: 3.84vw;
    line-height: 4.92vw;
	overflow: hidden;
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
}
</style>
