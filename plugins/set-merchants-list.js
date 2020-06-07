export default function (ctx) {
	const merchantsEnv = process.env.MERCHANTS_LIST || '';
	const merchants = merchantsEnv.split(',');
	ctx.store.state.monoMerchants = merchants;
	sessionStorage.setItem('monoMerchants', merchantsEnv);
}
