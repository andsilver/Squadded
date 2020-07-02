import { MERCHAND_ADMIN } from '~/consts';

export const discoverItem = function () {
	const isExplore = this.me.userRole === MERCHAND_ADMIN || !this.merchant.hideFeatures.includes('explore');
	isExplore ? this.$router.push('/explore') : this.$router.push('/all');
};
