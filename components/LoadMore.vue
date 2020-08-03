<!-- In order to have the ability to use icon, this component has been extracted from: https://github.com/duyanpeng/vue-quick-loadmore -->
<template>
	<div class="garen-loadmore" :style="{overflow:bottomOverflow}" @scroll.passive="handleScroll">
		<div ref="content" class="garen-loadmore-content">
			<slot name="top">
				<div class="garen-loadmore-header">
					<v-icon v-html="topText" />
				</div>
			</slot>
			<slot />
			<slot name="bottom">
				<div v-if="!disableBottom" class="garen-loadmore-footer" @click="onBottomErrorClick">
					<div>{{ bottomText }}</div>
				</div>
			</slot>
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
const BOTTOMSTATUS = {
	wait: 'wait',
	loading: 'loading',
	nodata: 'nodata',
	error: 'error',
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
			default() {
				return {};
			},
		},
		disableBottom: {
			type: Boolean,
			default: false,
		},
		bottomDistance: {
			type: Number,
			default: 10,
		},
		bottomChangeText: {
			type: Object,
			default() {
				return {};
			},
		},
		eventScroll: {
			type: Function,
		},
	},
	data() {
		return {
			startPositionTop: null,
			startScreenY: 0,
			endScreenY: 0,
			topStatus: TOPSTATUS.wait,
			bottomOverflow: 'auto',
			bottomStatus: BOTTOMSTATUS.wait,
		};
	},
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
		bottomText() {
			switch (this.bottomStatus) {
			case BOTTOMSTATUS.loading:
				return this.bottomChangeText.loading || 'Loading...';
			case BOTTOMSTATUS.nodata:
				return this.bottomChangeText.nodata || 'No data';
			case BOTTOMSTATUS.error:
				return this.bottomChangeText.error || 'Error';
			default:
				return '';
			}
		},
	},
	watch: {
		topStatus(next) {
			this.$emit('top-status-change', next);
		},
		bottomStatus(next) {
			this.$emit('bottom-status-change', next);
		},
	},
	mounted() {
		this.init();
	},
	methods: {
		handleScroll() {
			this.eventScroll && this.eventScroll();
			if (this.disableBottom) {
				return;
			}
			if (this.bottomStatus !== BOTTOMSTATUS.wait) {
				return;
			}
			const bDistance =
        this.$el.scrollHeight - this.$el.scrollTop - this.$el.clientHeight;
			if (bDistance <= this.bottomDistance) {
				this.bottomStatus = BOTTOMSTATUS.loading;
				this.$nextTick(() => {
					try {
						this.$el.scrollTo(0, this.$el.scrollHeight);
					} catch (e) {}
				});
				this.$emit('bottom-method');
			}
		},
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
				(screenY - this.startScreenY) / this.distanceIndex >=
        this.topDistance
			) {
				this.transformStyle(this.$refs.content, this.topLoadingDistance, true);
				this.topStatus = TOPSTATUS.loading;
				// 下拉刷新触发方法
				this.$emit('top-method');
				if (!this.disableBottom) {
					this.bottomStatus = BOTTOMSTATUS.wait;
				}
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
		onBottomLoaded(flag = true) {
			if (flag) {
				this.bottomStatus = BOTTOMSTATUS.wait;
			} else {
				this.bottomStatus = BOTTOMSTATUS.nodata;
			}
		},
		onBottomError() {
			this.bottomStatus = BOTTOMSTATUS.error;
		},
		onBottomErrorClick() {
			if (this.bottomStatus === BOTTOMSTATUS.error) {
				this.bottomStatus = BOTTOMSTATUS.loading;
				this.$emit('bottom-error-click');
			}
		},
		transformStyle(target, moveDistance, transition, timer = 200) {
			target.style['-webkit-transform'] =
        'translate3d(0,' + moveDistance + 'px,0)';
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
  overflow: auto;
  -webkit-overflow-scrolling: touch;
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
.garen-loadmore-footer {
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 13px;
  color: #666666;
  letter-spacing: -0.31px;
}
</style>
