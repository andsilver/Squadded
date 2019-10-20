export class User {
	constructor(props = {}) {
		const {
			avatar,
			bio,
			blog = [],
			followers = {
				count: 0,
			},
			following = 0,
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
		this.likes = likes;
		this.mention = mention;
		this.name = name || screenName;
		this.userId = userId;
	}

	short () {
		return {
			guid: this.userId,
			screenName: this.name,
			avatar: this.avatar,
		};
	}
}
