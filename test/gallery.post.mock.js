import { Chance } from 'chance';
const chance = new Chance();

export const galleryPostBuilder = () => ({
	get: () => ({
		text: chance.word(),
		type: 'galleryPost',
		userId: chance.natural(),
		img: 'https://squadded-media-west-1.s3.eu-west-1.amazonaws.com/6c66392a-9a80-4438-ac43-2cef0d085bca.png',
		ts: 1580240089143,
		comments: { count: 0 },
		user: {
			avatar: 'https://graph.facebook.com/1269748286527000/picture?type=square&width=512',
			guid: '5d8a090ddc2113a2f6bbabb1',
			screenName: 'Gabriel',
		},
		guid: chance.natural(),
		items: [
			{
				varId: '',
				itemId: '10562253',
				title: 'PrettyLittleThing Broderie...',
				price: 3871,
				currency: '€',
				img: 'https://sam-advisor.com/myboutique/img/p/2/3/4/234-home_default.jpg',
				url:
					'https://sam-advisor.com/myboutique/index.php?id_product=10562253&id_product_attribute=0&rewrite=prettylittlething-broderie-insert-midi-dress-in-floral&controller=product',
				squadded: true,
			},
		],
		likes: { count: 0 },
		byMe: false,
	}),
});
