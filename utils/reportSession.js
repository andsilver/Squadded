export const storePostReportInSession = (post) => {
	if (!post || !post.guid) {
		return;
	}
	sessionStorage.setItem(`reported_post_${post.guid}`, `${Date.now()}`);
};

export const storeCommentReportInSession = (comment) => {
	if (!comment || !comment._id) {
		return;
	}
	sessionStorage.setItem(`reported_comment_${comment._id}`, `${Date.now()}`);
};

export const postReported = (post) => {
	if (!post) {
		return false;
	}
	return !!sessionStorage.getItem(`reported_post_${post.guid}`);
};

export const commentReported = (comment) => {
	if (!comment) {
		return false;
	}
	return !!sessionStorage.getItem(`reported_comment_${comment._id}`);
};
