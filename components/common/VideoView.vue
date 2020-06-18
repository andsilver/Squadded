<template>
	<div v-observe-visibility="visibilityChanged" class="video-view" />
</template>

<script>
import Embedo from 'embedo';

const embedo = new Embedo({
	twitter: true,
	instagram: true,
});

const youtube = {
	REGEX: /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/,
	aspect: 0.75,
	fix (url) {
		return url;
	},
};
const instagram = {
	REGEX: /(http|https)?:\/\/(www\.)?instagram.com\/tv\/[a-zA-Z0-9_/?\-=]+/gi,
	aspect: 1.410179640718563,
	options: {
		hidecaption: true,
	},
	fix (url) {
		const toFix = new URL(url);
		toFix.search = '';
		const isEmbed = (/\/embed/).test(toFix.pathname);
		const isTrailingSlash = (/\/$/).test(toFix.pathname);
		return isEmbed ? toFix.href : `${toFix.href}${!isTrailingSlash ? '/' : ''}embed`;
	},
};
const vimeo = {
	REGEX: /(http|https)?:\/\/(www\.)?vimeo(\.[a-z]+)\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|)(\d+)(?:|\/\?)/,
	aspect: 0.75,
	fix (url) {
		return url;
	},
};

const SOURCES = {
	instagram,
	youtube,
	vimeo,
};

export default {
	props: {
		videoLink: {
			type: String,
			required: true,
		},
	},
	watch: {
		videoLink (current, prev) {
			if (current !== prev) {
				embedo.destroy(this.$el);
				this.embed();
			}
		},
	},
	mounted () {
		this.embed();
	},
	methods: {
		done () {
			this.$emit('done');
		},
		fail () {
			this.$emit('fail');
		},
		embed () {
			if (!this.videoLink) {
				this.fail();
				return true;
			}
			const matched = this.validateLink(this.videoLink);
			if (!matched) {
				this.fail();
				return;
			}
			const width = this.$el.clientWidth - 35;
			const height = width * matched.aspect;
			if (!width) {
				return;
			}
			embedo
				.load(this.$el, matched.fix(this.videoLink), {
					width,
					height,
					...matched.options,
				})
				.done(this.done.bind(this))
				.fail(this.fail.bind(this));
		},
		validateLink (url) {
			const sources = Object.keys(SOURCES) || [];
			const matched = sources.find(service => (SOURCES[service] && url.match(SOURCES[service].REGEX)));
			return SOURCES[matched];
		},
		visibilityChanged(isVisible) {
			const width = this.$el.clientWidth - 35;
			const request = embedo.requests.filter(req => req.el === this.$el)[0];
			if (isVisible && (!request || request.attributes.width !== width)) {
				embedo.destroy(this.$el);
				this.embed();
			}
		},
	},
};
</script>

<style lang="stylus" scoped>
.video-view
	margin 0 auto
	min-width 100%
	text-align center
	>>>
		div
			overflow hidden
		embed
			margin-top -54px
.video-preview.video-view
	margin 10.46vw auto 0vw
	width calc(100% - 4.61vw)
	box-shadow rgba(0,0,0,0.1) 0px 0.92vw 6.153vw
	padding 4.61vw
	min-height 50vh
	text-align center
	background-image url('~assets/img/video-empty.svg')
	background-size 60%
	background-position center
	&.last-screen
		width 70%
		padding 0
		min-width auto
		min-height auto
		box-shadow none
		margin-top 6.5vw
		margin-bottom 4vw

</style>
