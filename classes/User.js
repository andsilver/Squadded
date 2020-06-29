export class User {
	constructor(props = {}) {
		const {
			avatar,
			bio,
			blog = [],
			followers = {
				count: 0,
			},
			following = {
				count: 0,
			},
			guid,
			influencer = false,
			isMe = false,
			likes = 0,
			mention,
			name,
			screenName,
			userId,
			_id,
			squad,
			nameSelected,
			squaddersCount,
			language,
			origin,
			originUserId,
			originPostId,
			miniAvatar,
			userRole,
		} = props;

		this.avatar = avatar;
		this.bio = bio;
		this.blog = blog;
		this.followers = followers;
		this.following = following;
		this.influencer = influencer;
		this.isMe = isMe;
		this.likes = likes;
		this.mention = mention;
		this.name = name;
		this.screenName = screenName || name;
		this.userId = userId || guid || _id;
		this.guid = this.userId;
		this.private = props.private || false;
		squad && (this.squad = squad);
		this.nameSelected = !!nameSelected;
		this.squaddersCount = squaddersCount || 0;
		this.language = language;
		this.origin = origin;
		this.originUserId = originUserId;
		this.originPostId = originPostId;
		this.miniAvatar = miniAvatar;
		userRole && (this.userRole = userRole);
	}

	short () {
		return {
			avatar: this.avatar,
			guid: this.userId,
			isMe: this.isMe,
			screenName: this.screenName || this.name,
			miniAvatar: this.miniAvatar,
		};
	}
}
