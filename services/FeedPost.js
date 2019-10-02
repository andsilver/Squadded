const INFINITE_FUTURE_TS_FOR_ALWAYS_ON_TOP = Number.MAX_SAFE_INTEGER;

export class FeedPost {
	constructor(props) {
		const {
			item = {},
			likes = {},
			comments = [],

			// TODO get user props.
			user = {
				avatar: '',
				screenName: '',
			},
			error = null,
			guid = null,
			ts = INFINITE_FUTURE_TS_FOR_ALWAYS_ON_TOP,
			correlationId,
		} = props;

		this.item = item;
		this.likes = likes;
		this.comments = comments;
		this.user = user;
		this.error = error;
		this.guid = guid;
		this.ts = ts;
		this.correlationId = correlationId;
	}

	unsetCorrelationId () {
		delete this.correlationId;
	}

	toStore () {
		const { comments, error, ...store } = this;
		return store;
	}

	toMessage () {
		const { guid, user, ts, comments, likes, ...clean } = this;
		clean.type = 'singleItemPost';
		return clean;
	}
}
