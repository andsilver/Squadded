
<template>
	<section>
		<UserInput ref="user-input" v-model="text" :placeholder="$t('photo.textPlaceholder')" class="input-section video-input" />
		<VideoView
			ref="video-preview"
			:value="post.videoLink"
			class="video-preview last-screen"
		/>
		<Button
			ref="edit-button"
			style="width:26.46vw;"
			class="edit-button"
			@click.native="$emit('edit')"
		>
			{{ $t('Edit') }}
		</Button>
		<div class="controls">
			<PublicToggle ref="public-toggle" :public="!user.me.private" />
			<InfluencerMode v-if="user.me.influencer" @click.native="editLinks = true" />
		</div>
		<AffiliateLinks v-if="editLinks" @done="editLinks = false" />
		<BottomFixed>
			<Button
				ref="done-button"
				class="post-button"
				@click.native="publishPost"
			>
				{{ $t('Post') }}
			</Button>
		</BottomFixed>
	</section>
</template>

<script>
import { mapState } from 'vuex';
import AffiliateLinks from './AffiliateLinks';
import { FeedPost } from '~/classes/FeedPost';
import Button from '~/components/common/Button';
import UserInput from '~/components/common/UserInput';
import VideoView from '~/components/common/VideoView';
import BottomFixed from '~/components/Create/BottomFixed';
import InfluencerMode from '~/components/Create/InfluencerMode';
import PublicToggle from '~/components/Create/PublicToggle';

export default {
	components: {
		BottomFixed,
		Button,
		AffiliateLinks,
		InfluencerMode,
		PublicToggle,
		UserInput,
		VideoView,
	},
	props: {
		post: {
			type: FeedPost,
			required: true,
		},
	},
	data: () => ({
		editLinks: false,
		isPublic: true,
		text: '',
	}),
	computed: {
		...mapState([
			'user',
		]),
	},
	methods: {
		publishPost (state) {
			const { text } = this;
			const { isPublic } = this.$refs['public-toggle'];
			this.$emit('post', { text, isPublic });
		},
	},
};
</script>

<style lang="stylus" scoped>
.controls
	display flex
	flex-direction column
	align-items center
	width 100%
	margin-top 4vw
	> *
		padding 4vw 0
		border-top 0.46vw solid #DBDBDB

.post-button
	width 42.46vw
	height 12.30vw !important
	display block

.edit-button
	background-image url('~assets/img/refresh-icon.svg')
	background-color transparent !important
	width 23.07vw
	color #000
	border 2px solid #000
	font-size 2.15vw
	background-repeat no-repeat
	background-position 4vw
	padding-left 10vw !important
	background-size 3.69vw
	display block

@media screen and (max-width: 280px) {
	.edit-button {
		width: 29.46vw !important;
	}
}
</style>
