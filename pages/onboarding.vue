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
				overlay="linear-gradient(45deg, #00000099, #ffffff33)"
			/>
		</section>
		<div class="d-flex align-center justify-center onging-actions">
			<Button ref="signin-btn" class="flex-grow-1 mr-4" @click.native="signin">
				{{ $t('Signin') }}
			</Button>
			<v-btn ref="skip-btn" outlined depressed class="skip-btn flex-grow-1" @click="skip">
				{{ $t('landing_post.skip') }}
			</v-btn>
		</div>
	</div>
</template>

<script>
import Hammer from 'hammerjs';
import VideoBackground from 'vue-responsive-video-background-player';
import Button from '~/components/common/Button';

export default {
	components: {
		Button,
		VideoBackground,
	},
	data: () => ({
		current: 0,
		videos: [
			{
				url: '/Videos/step1.mp4',
				duration: 3,
			},
			{
				url: '/Videos/step2.mp4',
				duration: 3,
			},
			{
				url: '/Videos/step3.mp4',
				duration: 3,
			},
			{
				url: '/Videos/step4.mp4',
				duration: 3,
			},
		],
	}),
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
				changeBegin: (a) => {
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

.skip-btn {
	font-size: 0.6em;
	font-weight: 700;
	letter-spacing: 1px;
	border-radius: 10px;
	border-color: black;
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
