const INFINITE_FUTURE_TS_FOR_ALWAYS_ON_TOP = Number.MAX_SAFE_INTEGER;

export class FeedPost {
	constructor(props) {
		const {
			type,
			item = {},
			item1 = {},
			item2 = {},
			likes = {},
			comments = {},

			user = {
				avatar: '',
				screenName: '',
			},
			error = null,
			guid = null,
			postId = null,
			text,
			ts = INFINITE_FUTURE_TS_FOR_ALWAYS_ON_TOP,
			correlationId,
		} = props;

		this.type = type;
		this.likes = likes;
		this.comments = {
			count: comments.count || 0,
			messages: comments.messages || [],
		};
		this.user = user;
		this.error = error;
		this.guid = postId || guid;
		this.postId = postId || guid;
		this.text = text || '';
		this.ts = ts;
		this.correlationId = correlationId;

		if (type === 'pollPost') {
			this.item1 = item1;
			this.item2 = item2;
		} else {
			this.item = item;
		}
	}

	toMessage () {
		const { error, user, ts, comments, likes, ...clean } = this;

		return clean;
	}

	toStore () {
		const { comments, error, ...store } = this;

		return store;
	}

	update(freshPost) {
		const { comments, ...other } = freshPost;
		Object.assign(this, other);
		if (comments) {
			this.comments.count = comments.count;
		}
	}

	unsetCorrelationId () {
		delete this.correlationId;
	}
}