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
import { createNamespacedHelpers, mapState } from 'vuex';
import BackBar from '~/components/common/BackBar';
import StepBack from '~/components/common/StepBack';
import InputVideo from '~/components/Create/Steps/InputVideo';
import Items from '~/components/Create/Steps/Items';
import PostSettings from '~/components/Create/Steps/PostSettings';
import EmptyWishlist from '~/components/Create/EmptyWishlist';
import { FeedPost } from '~/classes/FeedPost';
import { ActivityStore, ActivityGetters } from '~/store/activity';
import { FeedStore, FeedMutations } from '~/store/feed';
import {
	PostStore,
	PostActions,
} from '~/store/post';

const { mapGetters } = createNamespacedHelpers(ActivityStore);

const createPost = async ({ store, text, isPublic, selected, videoLink }) => {
	try {
		const msg = {
			items: selected.map(post => post.item),
			private: !isPublic,
			text,
			type: 'videoPost',
			videoLink,
		};
		const post = await store.dispatch(`${PostStore}/${PostActions.saveItem}`, msg);
		post.ts = Date.now();
		post.guid = `new-${Date.now()}`;
		store.commit(`${FeedStore}/${FeedMutations.addItem}`, post);
	} catch (err) {
		//
	}
};

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
	data: () => ({
		step: INPUT_LINK,
		post: new FeedPost({
			type: 'videoPost',
			videoLink: '',
		}),
		videoLink: '',
	}),
	computed: {
		...mapGetters([
			ActivityGetters.getSelected,
		]),
		...mapState([
			'socket',
			'user',
		]),
		complete () {
			return this.getSelected.length;
		},
	},
	methods: {
		create (data) {
			const { text, isPublic } = data;
			createPost({
				store: this.$store,
				text,
				isPublic,
				selected: this.getSelected,
				videoLink: this.videoLink,
			});
			this.$router.push({
				path: '/feed',
			});
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
