<template>
	<div class="public-toggle">
		<div class="img" :class="{'is-active': isPublic}">
			<img v-if="isPublic" src="~assets/img/public.svg" class="logo">
			<img v-else src="~assets/img/private.svg" class="logo">
		</div>
		<div class="text" :class="{'is-active': isPublic}">
			<h4>
				{{ $t('privacy') }}
			</h4>
			<p>
				{{ $t(isPublic ? 'publicToggle.forEveryone' : 'publicToggle.forPrivate') }}
			</p>
			<span class="toggle-lab">
				<v-select
					v-model="defaultItem"
					:items="items"
					item-text="label"
					item-value="key"
					:hide-details="true"
					:menu-props="{ top: true }"
					class="expire-custom-select"
					@change="switchDate(`${defaultItem}`)"
				>
					<template slot="selection" slot-scope="data">
						<span class="expire-option">{{ $t(`${data.item.label}`) }}</span>
					</template>
					<template slot="item" slot-scope="data">
						<span class="expire-option">{{ $t(`${data.item.label}`) }}</span>
					</template>
				</v-select>
			</span>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		public: {
			type: Boolean,
			default: false,
		},
	},
	data: () => ({
		isPublic: true,
		selected: 0,
		defaultItem: '',
		items: [
			{ label: 'public' },
			{ label: 'private' },
		],
	}),
	mounted () {
		this.isPublic = this.public;
		this.defaultItem = this.items[this.isPublic ? 0 : 1];
	},
	methods: {
		switchDate (i) {
			this.selected = i;
			this.isPublic = !this.isPublic;
		},
	},
};
</script>

<style lang="stylus" scoped>
.poll-main-sec .public-toggle
	padding: 4vh 0;
.public-toggle
	display flex
	width:100%;
	.img
		width 8.30vw
		height 8.30vw
		background rgba(218, 217, 221, 0.30)
		border-radius 50%
		line-height 5.6vw
		text-align: center;
		img
			transition all 0.12s ease-in-out
			transform scale(1)
			width 3.38vw
			height 3.38vw
			vertical-align -webkit-baseline-middle
			vertical-align -moz-middle-with-baseline
		&.is-active img.logo
			transform scale(1.1)

	.text
		font-size 3.23vw
		text-align left
		color #000000
		font-weight 700
		padding-left 4.61vw
		margin-top 5px
		position relative
		width calc(100% - 8vw)
		p
			color #B8B8BA
			font-weight 500
			margin 6px 0 0 0 !important
			font-size 3.23vw
		span.toggle-lab
			position absolute
			right 4px
			top -5px
			max-width 23.3vw
			@media screen and (max-width 280px)
				max-width 26vw
span.expire-option
	font-size 3.23vw
	font-weight 700
	line-height 6.153vw;
</style>
