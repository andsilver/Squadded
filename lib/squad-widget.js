import css from './widget.css'

(() => {
	function getFrame(frameWidth) {
		const frame = document.createElement('iframe');
		frame.frameBorder = 0;
		frame.width = frameWidth;
		frame.src = 'https://squad-shopping.com/';
		return frame;
	}

	if (document.body.attachShadow) {
		const root = document.createElement('aside');

		const state = {
			open: false,
			frame: false,
		};

		root.style.position = 'fixed';
		root.style.top = '0px';
		root.style.bottom = '0px';
		root.style.right = '0px';
		root.style.zIndex = '9999';

		const style = document.createElement('style');
		style.innerHTML = css;

		const button = document.createElement('button');
		const cut = document.createElement('span');
		const container = document.createElement('div');
		container.classList.add('container');

		button.addEventListener('click', () => {
			const frameWidth = Math.min(window.innerWidth, 400) - 42;

			if (!state.open) {
				container.style.width = `${frameWidth}px`;
				if (!state.frame) {
					const frame = getFrame(frameWidth);
					frame.height = container.offsetHeight;
					container.append(frame);
					state.frame = true;
				}
			} else {
				container.style.width = '0';
			}
			container.classList.toggle('open');
			state.open = !state.open;
		});

		cut.appendChild(button);
		container.appendChild(cut);
		const shadow = root.attachShadow({ mode: 'closed' }); // Forbidden JS access inside
		shadow.appendChild(style);
		shadow.appendChild(container);
		document.body.appendChild(root);
	} else {
		// TODO log legacy browser
	}
})()
