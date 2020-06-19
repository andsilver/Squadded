<template>
	<div v-observe-visibility="visibilityChanged" class="video-view" :class="[ sourceName ]" />
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
	getHeight (width, url) {
		return width * this.aspect;
	},
	fixToSave (url) {
		return url;
	},
	fixToEmbed (url) {
		return url;
	},
};
const instagram = {
	REGEX: /(http|https)?:\/\/(www\.)?instagram.com\/(p|tv)\/[a-zA-Z0-9_/?\-=]+/gi,
	aspect: 1,
	options: {
		hidecaption: true,
	},
	async getHeight (width, url) {
		const isIGTVPost = (/\/tv\//).test(url);
		const aspect = await this.getAspect(url);
		return isIGTVPost ? width * aspect + 53 : width * aspect - 3;
	},
	fixToSave (url) {
		const toFix = new URL(url);
		toFix.search = '';
		const isEmbed = (/\/embed/).test(toFix.pathname);
		return isEmbed ? toFix.href.replaceAll('/embed', '') : toFix.href;
	},
	fixToEmbed (url) {
		const isRegularPost = (/\/p\//).test(url);
		const isTrailingSlash = (/\/$/).test(url);
		return isRegularPost ? url : `${url}${!isTrailingSlash ? '/' : ''}embed`;
	},
	getAspect (url) {
		const isIGTVPost = (/\/tv\//).test(url);
		return isIGTVPost ? 1.25
			: fetch(`https://api.instagram.com/oembed/?url=${url}`)
				.then(response => response.json())
				.then(data => data.thumbnail_height / data.thumbnail_width)
				.catch(() => this.aspect);
	},
};
const vimeo = {
	REGEX: /(http|https)?:\/\/(www\.)?vimeo(\.[a-z]+)\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|)(\d+)(?:|\/\?)/,
	aspect: 0.75,
	getHeight (width, url) {
		return width * this.aspect;
	},
	fixToSave (url) {
		return url;
	},
	fixToEmbed (url) {
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
		value: {
			type: String,
			required: true,
		},
	},
	data: () => ({
		sourceName: '',
		videoLink: '',
	}),
	watch: {
		value (current, prev) {
			if (current !== this.videoLink) {
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
			if (this.videoLink !== this.value) {
				this.$emit('input', this.videoLink);
			}
			const req = embedo.requests.filter(r => r.el === this.$el)[0];
			if (req.url.match(instagram.REGEX) && !req.el.firstElementChild.style.height) {
				req.el.firstElementChild.style.height = `${req.attributes.height - 54}px`;
			}
			this.$emit('done');
		},
		fail () {
			this.$emit('fail');
		},
		async embed () {
			if (this.videoLink === this.value) {
				return;
			}
			if (!this.value) {
				this.fail();
				return true;
			}
			const sourceName = this.validateLink(this.value);
			const source = SOURCES[sourceName];
			if (!source) {
				this.fail();
				return;
			}
			this.sourceName = sourceName;
			const computed = window.getComputedStyle(this.$el);
			const width = parseFloat(computed.getPropertyValue('width')) - parseFloat(computed.getPropertyValue('padding')) * 2;
			if (!width) {
				return;
			}
			this.videoLink = source.fixToSave(this.value);
			const height = await source.getHeight(width, this.videoLink);
			embedo
				.load(this.$el, source.fixToEmbed(this.videoLink), {
					width,
					height,
					...source.options,
				})
				.done(this.done.bind(this))
				.fail(this.fail.bind(this));
		},
		validateLink (url) {
			return Object.keys(SOURCES)
				.find(service => (SOURCES[service] && url.match(SOURCES[service].REGEX)));
		},
		visibilityChanged(isVisible) {
			const width = this.$el.clientWidth;
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
			transform none !important
			align-items unset !important
	&.instagram >>>
		div
			height 0
		embed, iframe
			margin-top -54px !important
			min-width unset !important
			width 100% !important
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
