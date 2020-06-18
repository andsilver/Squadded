import { API_ENDPOINT } from '~/config';
import GalleryPost from '~/components/Posts/GalleryPost';
import MultiItemPost from '~/components/Posts/MultiItemPost';
import SingleItemPost from '~/components/Posts/SingleItemPost';
import PollPost from '~/components/Posts/PollPost';
import GroupedPosts from '~/components/Posts/GroupedPosts';

const COMMUNITY_ENDPOINT = `${API_ENDPOINT}/community`;

export const fetchPost = async (postId) => {
	try {
		const response = await fetch(`${COMMUNITY_ENDPOINT}/post/${postId}`);
		const data = response.json();
		return data;
	} catch (error) {
		console.error(error); // eslint-disable-line no-console
		return null;
	}
};

const components = {
	singleItemPost: SingleItemPost,
	groupedPosts: GroupedPosts,
	pollPost: PollPost,
	outfitPost: MultiItemPost,
	galleryPost: GalleryPost,
	videoPost: GalleryPost,
};

export const getComponent = post => components[post.type];
