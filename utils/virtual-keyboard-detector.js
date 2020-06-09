export class VirtualKeyboardDetector {
	recentlyFocusedTimeoutDuration = 1000;
	previousViewportHeight;
	previousViewportWidth;
	viewportWidthWithoutVirtualKeyboard;
	viewportHeightWithoutVirtualKeyboard;
	currentViewportWidth;
	currentViewportHeight;

	virtualKeyboardVisible = false;
	recentlyFocused = false;
	recentlyFocusedTimeout = null;
	validFocusableElements = ['INPUT', 'TEXTAREA'];
	subscriptions = {};

	constructor(options) {
		if (typeof options !== 'undefined') {
			if (typeof options.recentlyFocusedTimeoutDuration !== 'undefined') {
				this.recentlyFocusedTimeoutDuration = options.recentlyFocusedTimeoutDuration;
			}
		}
		this.resetViewportSizes();
		this.initFocusListener();
		this.initBlurListener();
		this.initResizeListener();
	}

	get isIOSDevice() {
		if (
			navigator.userAgent.match(/iPhone/i) ||
			navigator.userAgent.match(/iPad/i) ||
			navigator.userAgent.match(/iPod/i)
		) {
			return true;
		}
		return false;
	}

	/**
	 * Public functions
	 */

	isVirtualKeyboardVisible() {
		return this.virtualKeyboardVisible;
	}

	getVirtualKeyboardSize() {
		if (!this.virtualKeyboardVisible) {
			return false;
		}
		return {
			width: this.currentViewportWidth,
			height: this.viewportHeightWithoutVirtualKeyboard - this.currentViewportHeight,
		};
	}

	// Subscribe
	on(eventName, fn) {
		if (typeof this.subscriptions[eventName] === 'undefined') {
			this.subscriptions[eventName] = [];
		}
		this.subscriptions[eventName].push(fn);
	}

	// Unsubscribe
	off(eventName, fn) {
		if (typeof this.subscriptions[eventName] === 'undefined') {
			return;
		}

		if (typeof fn === 'undefined') {
			this.subscriptions[eventName] = [];
		} else {
			let i = this.subscriptions[eventName].length;

			while (i--) {
				if (this.subscriptions[eventName][i] === fn) {
					this.subscriptions[eventName].splice(i, 1);
				}
			}
		}
	}

	// Publish
	trigger(eventName, args) {
		for (const i in this.subscriptions[eventName]) {
			if (typeof this.subscriptions[eventName][i] === 'function') {
				this.subscriptions[eventName][i](args);
			}
		}
	}

	/**
	 * Private functions
	 */

	// Reset all sizes. We presume the virtual keyboard is not visible at this stage.
	// We call this function on initialisation, so make sure you initialise the virtualKeyBoardListener at a moment when the virtual keyboard is likely to be invisible.
	resetViewportSizes() {
		this.currentViewportWidth = this.previousViewportWidth = this.viewportWidthWithoutVirtualKeyboard = window.innerWidth;
		this.currentViewportHeight = this.previousViewportHeight = this.viewportHeightWithoutVirtualKeyboard = window.innerHeight;
	}

	// Initialise the listener that checks for focus events in the whole document. This way we can also handle dynamically added focusable elements.
	initFocusListener() {
		document.addEventListener('focus', (e) => {
			this.documentFocusHandler(e);

			if (this.isIOSDevice) {
				this.virtualKeyboardVisibleHandler();
			}
		}, true);
	}

	initBlurListener() {
		document.addEventListener('focusout', (e) => {
			if (this.isIOSDevice) {
				this.virtualKeyboardHiddenHandler();
			}
		}, true);
	}

	// Handle the document focus event. We check if the target was a valid focusable element.
	documentFocusHandler(e) {
		if (typeof e.target !== 'undefined' && typeof e.target.nodeName !== 'undefined') {
			if (this.validFocusableElements.includes(e.target.nodeName)) {
				this.elementFocusHandler(e);
			}
		}
	}

	// Handle the case when a valid focusable element is focused. We flag that a valid element was recently focused. This flag expires after recentlyFocusedTimeoutDuration.
	elementFocusHandler(e) {
		if (this.recentlyFocusedTimeout !== null) {
			clearTimeout(this.recentlyFocusedTimeout);
			this.recentlyFocusedTimeout = null;
		}
		this.recentlyFocused = true;
		this.recentlyFocusedTimeout = setTimeout(this.expireRecentlyFocused.bind(this), this.recentlyFocusedTimeoutDuration);
	}

	expireRecentlyFocused() {
		this.recentlyFocused = false;
	}

	initResizeListener() {
		window.addEventListener('resize', this.resizeHandler.bind(this));
	}

	resizeHandler() {
		this.currentViewportWidth = window.innerWidth;
		this.currentViewportHeight = window.innerHeight;

		// If the virtual keyboard is tought to be visible, but the viewport height returns to the value before keyboard was visible, we presume the keyboard was hidden.
		if (
			this.virtualKeyboardVisible &&
			this.currentViewportWidth === this.previousViewportWidth &&
			this.currentViewportHeight >= this.viewportHeightWithoutVirtualKeyboard
		) {
			this.virtualKeyboardHiddenHandler();
		}

		// If the width of the viewport is changed, it's hard to tell wether virtual keyboard is still visible, so we make sure it's not.
		if (this.currentViewportWidth !== this.previousViewportWidth) {
			if ('activeElement' in document) {
				document.activeElement.blur();
			}
			this.virtualKeyboardHiddenHandler();
		}

		// If recently focused and viewport height is smaller then previous height, we presume that the virtual keyboard has appeared.
		if (
			!this.virtualKeyboardVisible &&
			this.recentlyFocused &&
			this.currentViewportWidth === this.previousViewportWidth &&
			this.currentViewportHeight < this.previousViewportHeight
		) {
			this.virtualKeyboardVisibleHandler();
		}

		// If the keyboard is presumed not visible, we save the current measurements as values before keyboard was shown.
		if (this.virtualKeyboardVisible === false) {
			this.viewportWidthWithoutVirtualKeyboard = this.currentViewportWidth;
			this.viewportHeightWithoutVirtualKeyboard = this.currentViewportHeight;
		}
		this.previousViewportWidth = this.currentViewportWidth;
		this.previousViewportHeight = this.currentViewportHeight;
	}

	virtualKeyboardVisibleHandler() {
		this.virtualKeyboardVisible = true;

		const eventData = {
			virtualKeyboardVisible: this.virtualKeyboardVisible,
			sizes: this.getSizesData(),
		};
		this.trigger('virtualKeyboardVisible', eventData);
	}

	virtualKeyboardHiddenHandler() {
		this.virtualKeyboardVisible = false;

		const eventData = {
			virtualKeyboardVisible: this.virtualKeyboardVisible,
			sizes: this.getSizesData(),
		};
		this.trigger('virtualKeyboardHidden', eventData);
	}

	getSizesData() {
		return {
			viewportWithoutVirtualKeyboard: {
				width: this.viewportWidthWithoutVirtualKeyboard,
				height: this.viewportHeightWithoutVirtualKeyboard,
			},
			currentViewport: {
				width: this.currentViewportWidth,
				height: this.currentViewportHeight,
			},
			virtualKeyboard: {
				width: this.currentViewportWidth,
				height: this.viewportHeightWithoutVirtualKeyboard - this.currentViewportHeight,
			},
		};
	}

	addEventListener = this.on;
	subscribe = this.on;
	removeEventListener = this.off;
	unsubscribe = this.off;
	publish = this.trigger;
	dispatchEvent = this.trigger;
};
