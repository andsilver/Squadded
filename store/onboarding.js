const widgetLocation = location.search || !document.referrer ? new URL(location.href)
	: new URL(document.referrer);

const urls = widgetLocation.searchParams.get('story');

function splitUrls(videosUrl) {
	const videos = videosUrl.split(';');
	if (!videos.length) {
		return;
	}
	return videos.map(url => ({
		url,
		duration: 3,
	}));
}

export const state = () => ({
	videos: urls ? splitUrls(urls) : [],
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
		state.videos = splitUrls(videosUrl);
	},
};

export default {
	namespaced: true,
	state,
	mutations,
};
