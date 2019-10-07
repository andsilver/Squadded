export class User {
	constructor(props = {}) {
		const {
			avatar,
			bio,
			following,
			followers,
			likes,
			mention,
			name,
			userId,
		} = props;

		this.avatar = avatar;
		this.bio = bio;
		this.following = following;
		this.followers = followers || {};
		this.likes = likes;
		this.mention = mention;
		this.name = name;
		this.userId = userId;
	}
}
