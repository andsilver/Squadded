export const home = {
	posts: [
		{
			text: 'Which one of these sweaters do you prefer?',
			type: 'pollPost',
			userId: '5d8a3851dc2113a2f6c70dd0',
			ts: 1584890305650,
			likes: {
				count: 151,
				byMe: false,
			},
			comments: {
				count: 13,
			},
			user: {
				avatar: require('assets/img/walkthrough-avatar.png'),
				guid: '5d8a3851dc2113a2f6c70dd0',
				screenName: 'Dianna Smiley',
				miniAvatar: require('assets/img/walkthrough-avatar.png'),
				mysquad: true,
				followed: true,
			},
			guid: '1234556633',
			item1: {
				varId: '',
				itemId: '12430240',
				title: 'Rose Balloon Sleeve  Knitted Sweater',
				price: 4995,
				currency: '€',
				img: require('assets/img/walkthrough-post.png'),
				url:
					'https://sam-advisor.com/myboutique/index.php?id_product=12430240&id_product_attribute=0&rewrite=rose-balloon-sleeve-knitted-sweater&controller=product',
				squadded: true,
				votes: 1,
			},
			item2: {
				varId: '',
				itemId: '12430241',
				title: 'Wide Cuff Balloon  Sleeve Knitted Sweater',
				price: 5995,
				currency: '€',
				img: 'https://i.imgur.com/9oPWGim.jpg',
				url:
					'https://sam-advisor.com/myboutique/index.php?id_product=12430241&id_product_attribute=0&rewrite=wide-cuff-balloon-sleeve-knitted-sweater&controller=product',
				squadded: false,
				votes: 0,
			},
			byMe: false,
		},
		{
			type: 'singleItemPost',
			userId: '5d8a3851dc2113a2f6c70dd0',
			text: '',
			ts: 1584815137801,
			comments: { count: 0 },
			user: {
				avatar: require('assets/img/home-avatar.svg'),
				guid: '5d8a3851dc2113a2f6c70dd0',
				screenName: 'Lara Harrison',
				miniAvatar: require('assets/img/home-avatar.svg'),
				mysquad: true,
				followed: true,
			},
			guid: '123344556',
			item: {
				varId: '',
				itemId: '11754653',
				title: 'ASOS DESIGN Curve Button...',
				price: 3871,
				currency: '€',
				img: 'https://sam-advisor.com/myboutique/img/p/2/8/2/282-home_default.jpg',
				url:
					'https://sam-advisor.com/myboutique/index.php?id_product=11754653&id_product_attribute=0&rewrite=asos-design-curve-button-through-satin-mini-skater-dress&controller=product',
				squadded: false,
				outfits: 3,
			},
			likes: { count: 0, byMe: false },
			byMe: false,
		},
	],
};

export const feed = {
	posts: [
		{
			type: 'singleItemPost',
			userId: '5e43e363170ae8fce3af970f',
			text: 'Love this',
			ts: 1585139368882,
			comments: { count: 0 },
			user: {
				avatar: require('assets/img/walkthrough-avatar.png'),
				guid: '5e43e363170ae8fce3af970f',
				screenName: 'Olivia S.',
				miniAvatar: require('assets/img/walkthrough-avatar.png'),
				mysquad: true,
				followed: false,
			},
			guid: '5e7b4ea8646bc6899ceb63e7',
			item: {
				varId: '',
				itemId: '12430241',
				title: 'Printed dress',
				price: 5995,
				currency: '€',
				img: require('assets/img/walkthrough-post.png'),
				url:
					'https://sam-advisor.com/myboutique/index.php?id_product=12430241&id_product_attribute=0&rewrite=wide-cuff-balloon-sleeve-knitted-sweater&controller=product',
				squadded: true,
				votes: 0,
				outfits: 2,
			},
			likes: { count: 0, byMe: false },
			byMe: true,
		},
		{
			type: 'singleItemPost',
			userId: '5d8a3851dc2113a2f6c70dd0',
			text: '',
			ts: 1585139000730,
			comments: { count: 0 },
			user: {
				avatar: require('assets/img/home-avatar.svg'),
				guid: '5d8a3851dc2113a2f6c70dd0',
				screenName: 'Natalia Leonard',
				miniAvatar: require('assets/img/home-avatar.svg'),
				mysquad: true,
				followed: true,
			},
			guid: '5e43c21b170ae8fce3a68f2e',
			item: {
				varId: '',
				itemId: '10562253',
				title: 'PrettyLittleThing Broderie...',
				price: 3871,
				currency: '€',
				img: 'https://sam-advisor.com/myboutique/img/p/2/3/4/234-home_default.jpg',
				url:
					'https://sam-advisor.com/myboutique/index.php?id_product=10562253&id_product_attribute=0&rewrite=prettylittlething-broderie-insert-midi-dress-in-floral&controller=product',
				squadded: true,
				outfits: 17,
			},
			likes: { count: 0, byMe: false },
			byMe: false,
		},
	],
	squadders: [
		{
			userId: '5d8a3851dc2113a2f6c70dd0',
			avatar: require('assets/img/home-avatar.svg'),
			screenName: 'Stephanie',
			miniAvatar: require('assets/img/home-avatar.svg'),
		},
	],
};
