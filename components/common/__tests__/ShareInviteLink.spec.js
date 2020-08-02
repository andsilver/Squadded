import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import ShareInviteLink from '../ShareInviteLink.vue';
import { merchantMockBuilder } from '~/test/merchant.mock';
import Store from '~/store';
import { getShortURL } from '~/services/short-url';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

jest.mock('~/services/short-url', () => ({
	getShortURL: jest.fn(),
}));

describe('ShareInviteLink', () => {
	let wrapper;
	let store;

	const merchant = merchantMockBuilder().get();
	const MESSENGER = 'messenger-share-invite';
	const WHATSAPP = 'whatsapp-share-invite';
	const EMAIL = 'email-share-invite';

	window.open = jest.fn();

	beforeEach(() => {
		process.env = Object.assign(process.env, { FB_APP_ID: 11 });
		const localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);
		store.state.merchant = merchant;
		getShortURL.mockReturnValue(Promise.resolve('shorturl'));

		wrapper = shallowMount(ShareInviteLink, {
			mocks: {
				$t: msg => msg,
			},
			store,
			localVue,
			data: () => ({
				shortUrl: null,
			}),
		});
	});

	it('check link messenger', () => {
		wrapper.setData({ shortUrl: 'shorturl' });
		const messengerButton = wrapper.ref(MESSENGER);
		messengerButton.trigger('click');
		const { siteUrl } = store.state.merchant;
		expect(window.open).toHaveBeenCalledWith(`https://www.facebook.com/dialog/send?app_id=${process.env.FB_APP_ID}&link=${wrapper.vm.shortUrl}&redirect_uri=${siteUrl}`);
	});

	it('check link whatsapp', () => {
		wrapper.setData({ shortUrl: 'shorturl' });
		const whatsappButton = wrapper.ref(WHATSAPP);
		whatsappButton.trigger('click');
		const content = wrapper.vm.$t('invite_your_friends.invite_body', { merchant: store.state.merchant.id });
		expect(window.open).toHaveBeenCalledWith(encodeURI(`https://api.whatsapp.com/send?text=${content}\n${wrapper.vm.shortUrl}`));
	});

	it('check link email', () => {
		wrapper.setData({ shortUrl: 'shorturl' });
		const emailButton = wrapper.ref(EMAIL);
		emailButton.trigger('click');
		const content = wrapper.vm.$t('invite_your_friends.invite_body', { merchant: store.state.merchant.id });
		expect(window.open).toHaveBeenCalledWith(`mailTo:?subject=${wrapper.vm.$t('invite_your_friends.invite_subject')}&body=${content}%0A${wrapper.vm.shortURL}`);
	});
});
