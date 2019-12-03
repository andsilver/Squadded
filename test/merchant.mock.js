import { Chance } from 'chance';

const chance = new Chance();

export const merchantMockBuilder = () => {
	const merchant = {
		id: chance.guid(),
		siteUrl: chance.name(),
		siteTitle: chance.name(),
	};

	return {
		get: () => merchant,
	};
};
