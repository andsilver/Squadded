<!-- In order to have the ability to use icon, this component has been extracted from: https://github.com/duyanpeng/vue-quick-loadmore -->
<template>
	<div class="garen-loadmore">
		<div ref="content" class="garen-loadmore-content">
			<slot name="top">
				<div class="garen-loadmore-header">
					<v-icon>
						{{ topText }}
					</v-icon>
				</div>
			</slot>
			<slot />
		</div>
	</div>
</template>

<script>
const TOPSTATUS = {
	wait: 'wait',
	pulling: 'pulling',
	limit: 'limit',
	loading: 'loading',
	complete: 'complete',
};
export default {
	name: 'Loadmore',
	components: {},
	props: {
		disableTop: {
			type: Boolean,
			default: false,
		},
		distanceIndex: {
			type: Number,
			default: 2,
		},
		topLoadingDistance: {
			type: Number,
			default: 50,
		},
		topDistance: {
			type: Number,
			default: 100,
		},
		topChangeText: {
			type: Object,
			default: () => ({}),
		},
	},
	data: () => ({
		startPositionTop: null,
		startScreenY: 0,
		endScreenY: 0,
		topStatus: TOPSTATUS.wait,
	}),
	computed: {
		topText() {
			switch (this.topStatus) {
			case TOPSTATUS.pulling:
				return this.topChangeText.pulling || 'Pull to load';
			case TOPSTATUS.limit:
				return this.topChangeText.limit || 'Release';
			case TOPSTATUS.loading:
				return this.topChangeText.loading || 'Loading...';
			case TOPSTATUS.complete:
				return this.topChangeText.complete || '';
			default:
				return '';
			}
		},
	},
	watch: {
		topStatus(next) {
			this.$emit('top-status-change', next);
		},
	},
	mounted() {
		this.init();
	},
	methods: {
		getScrollTop() {
			return this.$el.scrollTop;
		},
		setScrollTop(y) {
			this.$nextTick(() => {
				this.$el.scrollTop = parseFloat(y);
			});
		},
		init() {
			this.startPositionTop = this.$refs.content.getBoundingClientRect().top;
			if (!this.disableTop) {
				this.bindTouchEvents();
			}
		},
		bindTouchEvents() {
			this.$refs.content.addEventListener('touchstart', this.handleTouchStart);
			this.$refs.content.addEventListener('touchmove', this.handleTouchMove);
			this.$refs.content.addEventListener('touchend', this.handleTouchEnd);
		},
		handleTouchStart(e) {
			if (
				this.$refs.content.getBoundingClientRect().top < this.startPositionTop
			) {
				return;
			}
			if (this.topStatus === TOPSTATUS.loading) {
				return;
			}
			const screenY = e.touches[0].screenY;
			this.startScreenY = screenY;
		},
		handleTouchMove(e) {
			if (
				this.$refs.content.getBoundingClientRect().top < this.startPositionTop
			) {
				return;
			}
			if (this.topStatus === 'loading') {
				return;
			}
			const screenY = e.touches[0].screenY;
			const moveDistance = (screenY - this.startScreenY) / this.distanceIndex;
			if (
				this.$refs.content.getBoundingClientRect().top > this.startPositionTop
			) {
				this.topStatus = TOPSTATUS.pulling;
			}
			if (moveDistance >= this.topDistance) {
				this.topStatus = TOPSTATUS.limit;
			}
			if (moveDistance > 0) {
				e.preventDefault();
				e.stopPropagation();
				this.transformStyle(this.$refs.content, moveDistance);
			}
		},
		handleTouchEnd(e) {
			if (
				this.$refs.content.getBoundingClientRect().top < this.startPositionTop
			) {
				return;
			}
			if (
				this.topStatus === TOPSTATUS.pulling ||
				this.topStatus === TOPSTATUS.limit
			) {
				e.stopPropagation();
				e.preventDefault();
			}
			if (this.topStatus === 'loading') {
				return;
			}

			const screenY = e.changedTouches[0].screenY;

			if (
				(screenY - this.startScreenY) / this.distanceIndex >= this.topDistance
			) {
				this.transformStyle(this.$refs.content, this.topLoadingDistance, true);
				this.topStatus = TOPSTATUS.loading;
				// 下拉刷新触发方法
				this.$emit('top-method');
			} else {
				this.topStatus = TOPSTATUS.wait;
				this.transformStyle(this.$refs.content, 0);
				this.startScreenY = 0;
			}
		},
		onTopLoaded(time = 0) {
			setTimeout(() => {
				this.transformStyle(this.$refs.content, 0, true);
				this.startScreenY = 0;
			}, time);
			this.topStatus = TOPSTATUS.complete;
		},
		transformStyle(target, moveDistance, transition, timer = 200) {
			target.style['-webkit-transform'] = 'translate3d(0,' + moveDistance + 'px,0)';
			target.style.transform = 'translate3d(0,' + moveDistance + 'px,0)';
			target.style.transitionDuration = '0ms';
			if (transition) {
				target.style.transitionDuration = timer + 'ms';
			}
		},
	},
};
</script>
<style scoped>
.garen-loadmore {
  height: 100%;
}
.garen-loadmore-header {
  margin-top: -50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 14px;
  color: #666666;
  letter-spacing: -0.31px;
}
</style>
