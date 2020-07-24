import { mutations } from './onboarding';

describe('Onboarding store', () => {
	let state;

	beforeEach(() => {
		state = {
			videos: [],
		};
	});

	it('setVideos mutation', () => {
		const videos = ['1.com', '2.com'];
		mutations.setVideos(state, videos.join(';'));
		expect(state.videos).toEqual(videos.map(v => ({
			url: v,
			duration: 3,
		})));
	});
});
