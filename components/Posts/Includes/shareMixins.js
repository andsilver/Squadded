import MobileDetect from 'mobile-detect';
import { Base64 } from 'js-base64';
import { getShortURL } from '~/services/short-url';

const mobileDetect = new MobileDetect(window.navigator.userAgent);
const CANCELED_BY_USER = 20;

export const target = function () {
	const { siteUrl, siteTitle, native } = this.$store.state.merchant;
	return {
		id: this.post.guid,
		url: siteUrl,
		title: siteTitle,
		native,
	};
};

export const postLink = function () {
	const { API_ENDPOINT } = this.$store.state.squad;
	const target = JSON.stringify(this.target);
	return `${API_ENDPOINT}/community/post?t=${Base64.encode(target)}&utm_source=squadded&utm_medium=share&utm_campaign=squadded`;
};

export const share = function () {
	this.showShare = false;
	let url = '';
	if (!this.shortURL) {
		getShortURL(this.postLink, this.$store).then((url) => {
			this.shortURL = url;
		});
		url = this.postLink; // force the long url because the native pop up in iphone does not appear
	} else {
		url = this.shortURL;
	}
	this.showShareModal(url);
};

export const showShareModal = async function (url) {
	// navigator.share working only in the https
	// mobileDetect.mobile => get me the name of smatphone or tablet => true if have name
	if (navigator && navigator.share && mobileDetect.mobile()) {
		const { siteTitle } = this.$store.state.merchant;
		const toShare = {
			title: siteTitle,
			text: siteTitle,
			url,
		};
		await navigator.share(toShare).catch(function(error) {
			console.log('navite share', error);
			if (error.code !== CANCELED_BY_USER) {
				this.showModal();
			}
		});
	} else {
		this.showModal();
	}
};
