<template>
	<div
		ref="onboarding"
		class="onboarding-page"
	>
		<nav ref="onboarding-nav" :style="{ gridTemplateColumns: `repeat(${videos.length}, 1fr)` }">
			<div v-for="(video, index) in videos" :key="index">
				<div />
			</div>
		</nav>
		<section
			v-for="(video, index) in videos"
			:key="index"
			:class="index === current ? 'show' : 'hide'"
			class="section"
		>
			<VideoBackground
				ref="video"
				:src="video.url"
				class="video-background"
			/>
		</section>
		<div class="d-flex justify-center onging-actions">
			<Button ref="signin-btn" class="signin-btn" @click.native="signin">
				{{ $t('Signin') }} >
			</Button>
		</div>
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import Hammer from 'hammerjs';
import VideoBackground from 'vue-responsive-video-background-player';
import { OnboardingStore } from '~/store/onboarding';
import Button from '~/components/common/Button';
import { DEFAULT_LANDING } from '~/store/squad';

const { mapState } = createNamespacedHelpers(OnboardingStore);

export default {
	components: {
		Button,
		VideoBackground,
	},
	asyncData({ store, redirect }) {
		if (store.state.socket.isAuth) {
			redirect(DEFAULT_LANDING);
		}
	},
	data: () => ({
		current: 0,
	}),
	computed: {
		...mapState(['videos']),
	},
	mounted () {
		const timeline = this.$anime.timeline({
			autoplay: true,
			duration: 3000,
			easing: 'linear',
			loop: true,
		});

		this.videos.forEach((video, index) => {
			timeline.add({
				targets: this.$refs['onboarding-nav'].children[index].children[0],
				width: '100%',
				changeBegin: () => {
					this.current = index;
				},
			});
		});

		this.timeline = timeline;

		const hammertime = new Hammer(this.$refs.onboarding);
		hammertime.on('press', (e) => {
			if (!this.timeline) {
				return;
			}
			this.timeline.pause();
			const current = this.$refs.video[this.current];
			if (current && current.player) {
				current.player.pause();
			}
		});
		hammertime.on('pressup', (e) => {
			if (!this.timeline) {
				return;
			}
			this.timeline.play();
			const current = this.$refs.video[this.current];
			if (current && current.player) {
				current.player.play();
			}
		});
		hammertime.on('tap', (e) => {
			if (e.center.x > window.innerWidth / 2 && this.current < this.videos.length - 1) {
				this.current += 1;
				this.switchTimeline();
			} else if (e.center.x < window.innerWidth / 2 && this.current > 0) {
				this.current -= 1;
				this.switchTimeline();
			}
		});
	},
	methods: {
		skip () {
			this.$router.push('/community');
		},
		signin () {
			this.$router.push('/');
		},
		switchTimeline() {
			if (!this.timeline) {
				return;
			}
			this.timeline.pause();
			this.timeline.seek(this.current * 3000);
			this.timeline.play();
		},
	},
	head: () => ({
		title: 'Onboarding-Stories',
	}),
};
</script>

<style lang="scss" scoped>
.onboarding-page {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.signin-btn {
	font-size: 8px;
	width: 120px;
	height: 34px;
	min-height: 34px;
	border-radius: 10px;
}

.onging-actions {
	padding: 16px;
	position: fixed;
	width: 100%;
	bottom: 24px;
	z-index: 90;
}
nav{
	box-sizing: border-box;
	display: grid;
	grid-column-gap: 8px;
	grid-template-columns: repeat(3, 1fr);
	height: 6px;
	padding: 0 4px;
	position: fixed;
	top: 8px;
	width: 100%;
	z-index: 99;

	> div {
		background: rgba(255,255,255,0.3);
		height: 100%;
		border-radius: 10px;

		> div {
			background: rgba(255,255,255,0.7);
			height: 100%;
			width: 0%;
			border-radius: 10px;
		}
	}
}

.section {
	flex: 1;
	display: flex;
	transition: all ease 1s;

	.video-background {
		flex: 1;
	}
}

.show {
	opacity: 1;
	z-index: 5;
	position: relative;
}

.hide {
	top: 0;
	left: 0;
	opacity: 0;
	position: absolute;
	z-index: 2;
	width: 100%;
	height: 100%;
}
</style>
