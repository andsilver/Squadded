import { API_ENDPOINT } from '~/config';
import GalleryPost from '~/components/Posts/GalleryPost';
import MultiItemPost from '~/components/Posts/MultiItemPost';
import SingleItemPost from '~/components/Posts/SingleItemPost';
import PollPost from '~/components/Posts/PollPost';
import GroupedPosts from '~/components/Posts/GroupedPosts';
import QuestionPost from '~/components/Posts/QuestionPost';

const COMMUNITY_ENDPOINT = `${API_ENDPOINT}/community`;

export const fetchPost = async (postId) => {
	try {
		const response = await fetch(`${COMMUNITY_ENDPOINT}/post/${postId}`);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error); // eslint-disable-line no-console
		return null;
	}
};

export const fetchLastItems = async (merchantId) => {
	try {
		const response = await fetch(
			`${COMMUNITY_ENDPOINT}/lastitems` + (merchantId ? `?merchantId=${merchantId}` : ''),
		);
		const data = await response.json();
		return data.lastitems;
	} catch (error) {
		console.error(error); // eslint-disable-line no-console
		return [];
	}
};

const components = {
	singleItemPost: SingleItemPost,
	groupedPosts: GroupedPosts,
	pollPost: PollPost,
	outfitPost: MultiItemPost,
	galleryPost: GalleryPost,
	videoPost: GalleryPost,
	questionPost: QuestionPost,
};

export const getComponent = post => components[post.type];
