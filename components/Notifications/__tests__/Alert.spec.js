import { shallowMount, Wrapper, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Alert from '../Includes/Alert.vue';
import Store from '~/store';
import { NotificationStore, NotificationMutations } from '~/store/notification';
import { notifyAlert } from '~/test/notifications.mock';

Wrapper.prototype.ref = function(id) {
	return this.find({ ref: id });
};

describe('Notifications Alert', () => {
	let wrapper;
	let store;
	let localVue;

	const UNDO_BTN = 'undo-btn';
	const NOTIFICATION_TEXT = 'notification-text';
	const NOTIFICATION_IMAGE = 'notification-image';

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(Vuex);
		store = new Vuex.Store(Store);

		window.moment = jest.fn().mockReturnValue({
			fromNow: jest.fn(),
		});
		window.moment.locale = jest.fn();

		wrapper = shallowMount(Alert, {
			store,
			localVue,
			propsData: {
				notification: notifyAlert,
			},
			mocks: {
				$t: msg => msg,
				_i18n: {
					locale: 'en',
				},
			},
		});
	});

	it('should render correct elements', () => {
		expect(wrapper.ref(UNDO_BTN).exists()).toBe(true);
		expect(wrapper.ref(NOTIFICATION_TEXT).exists()).toBe(true);
		expect(wrapper.ref(NOTIFICATION_IMAGE).exists()).toBe(true);
	});

	it('should commit undo', () => {
		const undoBtn = wrapper.ref(UNDO_BTN);
		store.commit = jest.fn();
		undoBtn.trigger('click');
		expect(store.commit).toHaveBeenCalledWith(`${NotificationStore}/${NotificationMutations.undo}`, {
			_id: notifyAlert._id,
			type: 'post',
			postId: notifyAlert.post.postId,
		});
	});
});
