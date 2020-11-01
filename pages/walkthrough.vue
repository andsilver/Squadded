<template>
	<div v-if="step < 4" class="flex-grow-1 d-flex flex-column walkthrough">
		<MockTopBar ref="topbar" />
		<div v-if="step < 3" class="mock-overlay-topbar">
			<span :style="{ color: step === 1 ? 'black' : 'transparent' }">{{ $t('topHome') }}</span>
			<span :style="{ color: step === 2 ? 'black' : 'transparent' }">{{ $t('My Squad') }}</span>
		</div>
		<div v-if="step === 2" class="squadders-overlay">
			<div>
				<span class="user-avatar-container">
					<div class="user-avatar-content">
						<img v-if="me.miniAvatar || me.avatar" :src="me.miniAvatar || me.avatar" alt>
						<div v-else ref="user-avatar" class="dummy_image" />
						<span class="user-name-hover">{{ me.screenName }}</span>
						<span class="online-status" />
					</div>
				</span>
				<AddFriendsButton
					v-if="step === 2"
					ref="plus-btn"
					class="add-friends-btn"
					color="white"
					:dark="true"
				/>
			</div>
		</div>
		<div class="flex-grow-1 container">
			<template v-if="step !== 1">
				<Squadders class="squadders walkthrough-squadders" :users="squadders" :has-post="true" />
				<SingleItemPost v-if="step > 2" :post="post" style="margin-top: 54px;" />
			</template>
		</div>
		<MockTabBar class="tab-bar" />
		<div class="overlay" />
		<div
			ref="popover"
			class="pop-over"
			:class="'pop-overstep-' + step"
			:style="{
				left: popoverLeft + 'px',
				top: popoverTop + 'px',
			}"
		>
			<div class="pop-over-content" :class="'step' + step">
				<template v-if="step === 1">
					<strong>{{ $t('walkthrough.step1.strong') }}</strong> {{ $t('walkthrough.step1.text') }}
					<div class="d-flex justify-end next-step-section">
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
			v-if="step !== 3"
			class="highlight"
			:style="{
				left: highlightLeft + 'px',
				top: highlightTop + 'px',
			}"
		/>
		<div
			v-if="step === 3"
			class="highlight walkthrogh"
		/>
		<ReSquaddButton
			v-if="step === 3"
			class="resquadd-btn walkthrogh"
			:item="post.item"
		/>
	</div>
</template>

<script>
import { feed } from '~/consts/walkthrough';
import MockTabBar from '~/components/Walkthrough/MockTabBar';
import MockTopBar from '~/components/Walkthrough/MockTopBar';
import { FeedPost } from '~/classes/FeedPost';
import SingleItemPost from '~/components/Posts/SingleItemPost';
import Squadders from '~/components/Squadders';
import Button from '~/components/common/Button';
import ReSquaddButton from '~/components/ReSquaddButton';
import AddFriendsButton from '~/components/common/AddFriendsButton';
import { STORAGE_VISITED_KEY } from '~/consts';
import { setLocalStorageItem } from '~/utils/local-storage';

export default {
	components: {
		MockTabBar,
		MockTopBar,
		Squadders,
		SingleItemPost,
		Button,
		ReSquaddButton,
		AddFriendsButton,
	},
	data: () => ({
		step: 0,
		post: null,
		squadders: [],
		popoverLeft: 0,
		popoverTop: 0,
		highlightLeft: 0,
		highlightTop: 0,
	}),
	computed: {
		me() {
			return this.$store.state.user.me;
		},
	},
	created () {
		this.post = new FeedPost(feed.posts[0]);
	},
	mounted() {
		this.squadders = [this.$store.state.user.me, ...feed.squadders];
		this.walk();
	},
	methods: {
		walk() {
			this.step += 1;
			if (this.step === 1) {
				this.popoverLeft = 27;
				this.popoverTop = 65;
				this.highlightLeft = 68;
				this.highlightTop = 20;
			} else if (this.step === 2) {
				this.popoverLeft = 27;
				this.popoverTop = 99;
				this.highlightLeft = 172;
				this.highlightTop = 20;
				this.$refs.topbar.tab = 1;
			} else if (this.step === 3) {
				this.popoverLeft = 16;
				this.popoverTop = 266;
				this.highlightLeft = 252;
				this.highlightTop = 223;
			} else {
				if (localStorage.getItem(STORAGE_VISITED_KEY)) {
					return this.$router.push('/feed');
				}
				setLocalStorageItem(STORAGE_VISITED_KEY, Date.now().toString());
				this.$router.push('/all');
			}
		},
	},
	head: () => ({
		title: 'Walkthrough',
	}),
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
		padding-top: 40px !important;
		overflow: hidden;
		height: 100vh;
	}
	.tab-bar {
		position: fixed;
		bottom: 0;
		width: 100%;
	}
	.next-step {
		font-size: 2.61vw;
		font-weight: bold;
		cursor: pointer;
		text-transform: uppercase;
		letter-spacing: 2px;
	}
	.mock-overlay-topbar {
		height: 40px;
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 999;
		padding-right: 12px !important;
		padding-left: 12px !important;
		display: flex;
		align-items: center;
		white-space: normal;
		font-size: 0.75em;
		font-weight: 700;
		letter-spacing: 0.0892857143em;
		line-height: normal;
		text-transform: capitalize;

		:first-child {
			margin-right: 4%;
		}
	}
	.add-friends-btn {
		top: 40px;
		position: fixed;
		z-index: 999;
	}
	.squadders-overlay {
		position: fixed;
		z-index: 100;
		top: 47px;

		> div {
			position: relative;

			> span {
				position: absolute;
				top: 0;
				left: 24px;
				z-index: 1;
			}

			.add-friends-btn {
				pointer-events: none;
				left: calc(24px + 7.79vw);
				z-index: 2;
			}
		}
	}
}
</style>
<style lang="stylus" scoped>
.user-avatar-container
	img
		width 36px
		height 36px
		border-radius 50%
		border 2px solid #fff
	.user-name-hover
		display none

	.online-status
		padding 5px
		border 2px solid white
		background #28f528
		border-radius 50%
		position absolute
		top 20px
		left -2px
		z-index 20
.pop-over
	position fixed
	box-shadow 0px 3px 16px 0px #00000036
	z-index 300
	border-radius: 10px;
	&-content
		width 85.17vw
		background rgba(255,255,255,0.97)
		border-radius 10px
		color black
		text-transform none
		padding 12px 16px
		text-align left
		font-size 3.69vw
		line-height 5vw
		font-weight 500
		&:after
			content ''
			border 15px solid transparent;
			position absolute

.pop-over-content.step1:after, .pop-over-content.step2:after, , .pop-over-content.step3:after {
	margin-bottom: -5px;
	border-bottom-color: #fff;
    left: 25px;
    top: -7px;
    margin-top: -16px;
}
.step2:after {
    left: 7.4vw !important;
}

.step3:after
	left 221px !important
	@media screen and (max-width 280px)
		left 159px !important
.highlight
	position fixed
	padding 1px
	border-radius 50%
	box-shadow: 0 0 0 7vw rgba(255, 255, 255, 0.7), 0 0 0 11vw rgba(255, 255, 255, 0.4) !important
	z-index 300
	background: rgba(255, 255, 255, 0.7);
	opacity: 0.8;

.resquadd-btn
	position fixed
	z-index 999
	pointer-events none
.next-step-section
	margin-top 3.5vw
.highlight.walkthrogh
	top 63.5vw
	left 70vw
	@media screen and (max-width 280px)
		top 71.25vw
		left 67.5vw
.resquadd-btn.walkthrogh
	top 59.5vw
	left 66.33vw
	@media screen and (max-width 280px)
		top 66.5vw
		left 62.6vw
@media screen and (max-width: 280px) {
	.pop-overstep-3 {
		top: 239px !important;
	}
}
</style>
