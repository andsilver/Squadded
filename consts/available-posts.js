import { MERCHAND_ADMIN } from '~/consts';

export const availablePosts = [{
	uri: '/create/question',
	title: 'create.question',
	des: 'createDesc.question',
	images: require('~/assets/img/question.svg'),
	name: 'question',
}, {
	uri: '/create/outfit',
	title: 'create.outfit',
	des: 'createDesc.outfit',
	images: require('~/assets/img/outfit.svg'),
	name: 'outfit',
}, {
	uri: '/create/upload',
	title: 'create.upload',
	des: 'createDesc.upload',
	images: require('~/assets/img/photo.svg'),
	name: 'gallery',
}, {
	uri: '/create/poll',
	title: 'create.poll',
	des: 'createDesc.poll',
	images: require('~/assets/img/poll.svg'),
	name: 'poll',
}];

export const visiblePosts = function () {
	return this.me.userRole === MERCHAND_ADMIN ? availablePosts
		: availablePosts.filter((item) => {
			return !this.merchant.hideFeatures.includes(item.name);
		});
};

export const postTab = function () {
	return {
		uri: this.visiblePosts[0].uri,
		icon: 'sqdi-add-post',
		text: this.visiblePosts[0].title,
	};
};
