import { WidgetIPC } from '~/classes/WidgetIPC';

export default function (ctx) {
	const { store, app: { router } } = ctx;
	const ipc = new WidgetIPC(store, router);

	function parseMessage (event) {
		let msg;
		try {
			msg = JSON.parse(event.data);
			ipc.dispatch(msg);
		} catch (error) {
			// TODO: gracefull report
		}
	}

	window.addEventListener('message', parseMessage);
	window.parent.postMessage('SquadWidgetIsReady', '*');
};
