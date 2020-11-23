<template>
	<v-container v-if="socket.isAuth" class="video-main-sec">
		<BackBar v-if="step === 0" ref="goback-bar" :title="$t('SocialVideo')" :close="true" />
		<StepBack v-else :title="$t('SocialVideo')" @back="goBack" />
		<v-layout column class="mt-3 video-item">
			<EmptyWishlist />
			<InputVideo v-show="step === 0" @next="getLink" />
			<div v-show="step === 1" class="video-item-subtitle">
				To tag items that appear in your video, select them from your wishlist
			</div>
			<Items v-show="step === 1" ref="select-items" :max="20" @next="next" />
			<PostSettings
				v-show="step === 2"
				:post="post"
				@edit="edit"
				@post="create"
			/>
		</v-layout>
	</v-container>
</template>

<script>
import BackBar from '~/components/Create/BackBar';
import StepBack from '~/components/common/StepBack';
import InputVideo from '~/components/Create/Steps/InputVideo';
import Items from '~/components/Create/Steps/Items';
import PostSettings from '~/components/Create/Steps/PostSettings';
import EmptyWishlist from '~/components/Create/EmptyWishlist';
import { FeedPost } from '~/classes/FeedPost';
import createPost from '~/mixins/create-post';

const INPUT_LINK = 0;

export default {
	components: {
		BackBar,
		StepBack,
		EmptyWishlist,
		InputVideo,
		Items,
		PostSettings,
	},
	mixins: [createPost],
	data: () => ({
		step: INPUT_LINK,
		post: new FeedPost({
			type: 'videoPost',
			videoLink: '',
		}),
		videoLink: '',
	}),
	computed: {
		complete () {
			return this.selected.length;
		},
	},
	methods: {
		async create (data) {
			const { text, isPublic } = data;
			const p = await this.createPost({
				type: 'videoPost',
				text,
				private: !isPublic,
				items: this.selected.map(post => post.item),
				videoLink: this.videoLink,
			});
			p.ts = Date.now();
			p.guid = `new-${Date.now()}`;
		},
		edit() {
			this.step = 0;
		},
		getLink (link) {
			this.videoLink = this.post.videoLink = link;
			this.step += 1;
		},
		goBack() {
			this.step -= 1;
		},
		next () {
			this.step += 1;
		},
	},
	head: () => ({
		title: 'Create-Video',
	}),
};
</script>

<style lang="stylus" scoped>
.video-main-sec h2
	color #000
	font-size 4.307vw
	font-weight bold
	text-align center
	padding-bottom 0px
	position relative
	line-height 36px
	width 100%
	button
		position absolute
		left 0
.video-item-subtitle
	font-size 3.23vw
	text-align center
	width 74.30vw
	margin 0 auto 0.46vw
	line-height 4.30vw
</style>
