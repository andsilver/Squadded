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
			isMe = false,
			likes = 0,
			mention,
			name,
			screenName,
			userId,
		} = props;

		this.avatar = avatar;
		this.bio = bio;
		this.blog = blog;
		this.followers = followers;
		this.following = following;
		this.isMe = isMe;
		this.likes = likes;
		this.mention = mention;
		this.name = name || screenName;
		this.screenName = this.name;
		this.userId = userId || guid;
		this.guid = this.userId;
	}

	short () {
		return {
			avatar: this.avatar,
			guid: this.userId,
			isMe: this.isMe,
			screenName: this.name,
		};
	}
}
