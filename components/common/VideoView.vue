<template>
	<div v-observe-visibility="visibilityChanged" class="video-view" :class="[ sourceName ]" :style="{ height }" />
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
		return isEmbed ? toFix.href.replace('/embed', '') : toFix.href;
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
		height: '0px',
	}),
	watch: {
		value (current, prev) {
			if (current !== this.videoLink) {
				this.embed();
			}
		},
	},
	methods: {
		getWidth () {
			const computed = window.getComputedStyle(this.$el);
			return parseFloat(computed.getPropertyValue('width') || '0') - parseFloat(computed.getPropertyValue('padding') || '0') * 2;
		},
		done () {
			if (this.videoLink !== this.value) {
				this.$emit('input', this.videoLink);
			}
			const req = embedo.requests.filter(r => r.el === this.$el)[0];
			if (req.url.match(instagram.REGEX) && !req.el.firstElementChild.style.height) {
				this.height = req.el.firstElementChild.style.height = `${req.attributes.height - 54}px`;
			}
			this.$emit('done');
		},
		fail () {
			this.$emit('fail');
		},
		async embed () {
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
			const width = this.getWidth();
			if (!width) {
				return;
			}
			this.videoLink = source.fixToSave(this.value);
			const height = await source.getHeight(width, this.videoLink);
			this.height = `${height}px`;
			embedo.destroy(this.$el);
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
			const width = this.getWidth();
			const request = embedo.requests.filter(req => req.el === this.$el)[0];
			if (isVisible && (!request || request.attributes.width !== width)) {
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
	background-color #f1f1f1
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
	&:empty
		padding-bottom 75%

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
