export const state = () => ({
	videos: [],
});

export const OnboardingStore = 'onboarding';

export const OnboardingMutations = {
	setVideos: 'setVideos',
};

export const mutations = {
	[OnboardingMutations.setVideos]: (state, videosUrl) => {
		if (!videosUrl) {
			return;
		}
		const videos = videosUrl.split(';');

		if (!videos.length) {
			return;
		}
		state.videos = videos.map(url => ({
			url,
			duration: 3,
		}));
	},
};

export default {
	namespaced: true,
	state,
	mutations,
};
