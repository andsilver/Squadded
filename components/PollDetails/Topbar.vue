<template>
	<h2 class="d-flex justify-space-between">
		<GoBackBtn ref="go-back-btn" />
		<span ref="poll-details-title">{{ $t('poll.details') }}</span>
		<span>
			<PopMenu ref="popmenu" :post="post" />
		</span>
	</h2>
</template>

<script>
import GoBackBtn from '~/components/common/GoBackBtn';
import PopMenu from '~/components/Posts/Includes/PopMenu';
import { FeedPost } from '~/classes/FeedPost';

export default {
	components: {
		GoBackBtn,
		PopMenu,
	},
	props: {
		post: {
			type: FeedPost,
			required: true,
		},
	},
};
</script>
