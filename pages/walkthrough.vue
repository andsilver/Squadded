<template>
	<div class="flex-grow-1 d-flex flex-column walkthrough">
		<MockTopBar ref="topbar" />
		<div class="flex-grow-1 container">
			<Feed v-if="step === 1" :items="posts" />
			<template v-else>
				<Squadders class="squadders" :users="squadders" />
				<SingleItemPost v-for="(post, index) of posts" :key="index" :post="post" />
			</template>
		</div>
		<MockTabBar class="tab-bar" />
		<div class="overlay" />
		<div
			ref="popover"
			class="pop-over"
			:style="{
				left: popoverLeft + 'px',
				top: popoverTop + 'px',
			}"
		>
			<div class="pop-over-content" :class="'step' + step">
				<template v-if="step === 1">
					<strong>{{ $t('walkthrough.step1.strong') }}</strong> {{ $t('walkthrough.step1.text') }}
					<div class="d-flex justify-end">
						<a class="next-step" @click="walk">
							{{ $t('walkthrough.next') }}
						</a>
					</div>
				</template>
				<template v-else-if="step === 2">
					<strong>{{ $t('walkthrough.step2.strong') }}</strong> {{ $t('walkthrough.step2.text') }}
					<div class="d-flex justify-end">
						<a class="next-step" @click="walk">
							{{ $t('walkthrough.next') }}
						</a>
					</div>
				</template>
				<template v-else-if="step === 3">
					{{ $t('walkthrough.step3.text1') }}
					<strong>{{ $t('walkthrough.step3.strong') }}</strong>
					{{ $t('walkthrough.step3.text2') }}
					<div class="d-flex justify-center mt-4">
						<Button @click.native="walk">
							{{ $t('walkthrough.step3.start_shopping') }}
						</Button>
					</div>
				</template>
			</div>
		</div>
		<div
			class="highlight"
			:style="{
				left: highlightLeft + 'px',
				top: highlightTop + 'px',
			}"
		/>
		<ReSquaddButton
			v-if="step === 3"
			class="resquadd-btn"
			:item="posts[0].item"
			:style="{
				left: highlightLeft - 14 + 'px',
				top: highlightTop - 14 + 'px',
			}"
		/>
	</div>
</template>

<script>
import { home, feed } from '~/consts/walkthrough';
import Feed from '~/components/Feed';
import MockTabBar from '~/components/Walkthrough/MockTabBar';
import MockTopBar from '~/components/Walkthrough/MockTopBar';
import { FeedPost } from '~/classes/FeedPost';
import SingleItemPost from '~/components/Posts/SingleItemPost';
import Squadders from '~/components/Squadders';
import Button from '~/components/common/Button';
import ReSquaddButton from '~/components/ReSquaddButton';
import { STORAGE_VISITED_KEY } from '~/consts';

export default {
	components: {
		MockTabBar,
		MockTopBar,
		Squadders,
		Feed,
		SingleItemPost,
		Button,
		ReSquaddButton,
	},
	data: () => ({
		step: 0,
		posts: [],
		squadders: [],
		popoverLeft: 0,
		popoverTop: 0,
		highlightLeft: 0,
		highlightTop: 0,
	}),
	mounted() {
		this.squadders = [this.$store.state.user.me, ...feed.squadders];
		this.walk();
	},
	methods: {
		walk() {
			this.step += 1;
			if (this.step === 1) {
				this.posts = home.posts.map(p => new FeedPost(p));
				this.popoverLeft = 10;
				this.popoverTop = 60;
				this.highlightLeft = 50;
				this.highlightTop = 20;
			} else if (this.step === 2) {
				this.posts = feed.posts.map(p => new FeedPost(p));
				this.popoverLeft = 10;
				this.popoverTop = 93;
				this.highlightLeft = 120;
				this.highlightTop = 20;
				this.$refs.topbar.tab = 1;
			} else if (this.step === 3) {
				this.popoverLeft = 16;
				this.popoverTop = 266;
				this.highlightLeft = 251;
				this.highlightTop = 227;
			} else {
				if (localStorage.getItem(STORAGE_VISITED_KEY)) {
					return this.$router.push('/feed');
				}
				localStorage.setItem(STORAGE_VISITED_KEY, Date.now().toString());
				this.$router.push('/all');
			}
		},
	},
};
</script>
<style lang="scss">
.squadders .squadders-users {
	top: 40px;
}
</style>
<style lang="scss" scoped>
.walkthrough {
	position: relative;
	overflow: hidden;

	.overlay {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background: rgba($color: #000000, $alpha: 0.3);
		z-index: 99;
	}

	.container {
		padding-top: 60px;
		overflow: hidden;
		height: 100vh;
	}
	.tab-bar {
		position: fixed;
		bottom: 0;
		width: 100%;
	}
	.next-step {
		font-size: 12px;
		font-weight: bold;
		cursor: pointer;
		text-transform: uppercase;
	}
}
</style>
<style lang="stylus" scoped>
.pop-over
	position fixed
	box-shadow 0px 3px 16px 0px #00000036
	z-index 300
	border-radius: 10px;
	&-content
		width 92vw
		background #fff
		border-radius 10px
		color black
		text-transform none
		padding 12px 16px
		text-align left
		font-size 14px
		line-height 20px
		font-weight 500
		&:after
			content ''
			border 15px solid transparent;
			position absolute

.pop-over-content.step1:after, .pop-over-content.step2:after, , .pop-over-content.step3:after {
	margin-bottom: -5px;
	border-bottom-color: #fff;
    left: 23px;
    top: -7px;
    margin-top: -16px;
}

.step2:after {
    left: 51px !important;
}

.step3:after
	left 221px !important

.highlight
	position fixed
	padding 1px
	border-radius 50%
	box-shadow: 0 0 0 20px rgba(255, 255, 255, 0.7), 0 0 0 30px rgba(255, 255, 255, 0.4) !important
	z-index 300
	background: rgba(255, 255, 255, 0.7);

.resquadd-btn
	position fixed
	z-index 999
	pointer-events none
</style>
