import { MERCHAND_ADMIN } from '~/consts';

export const availablePosts = [{
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
		: availablePosts.filter(item => !this.merchant.hideFeatures.includes(item.name));
};
