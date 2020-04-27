import escape from 'lodash/escape';
import template from 'lodash/template';

export const MENTION = '@';

export const utils = {
	htmlEncode: (str) => {
		return escape(str);
	},
	regexpEncode: (str) => {
		// eslint-disable-next-line
		return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
	},
	highlightTerm: (value, term) => {
		if (!term && !term.length) {
			return value;
		}
		return value.replace(
			new RegExp('(?![^&;]+;)(?!<[^<>]*)(' + term + ')(?![^<>]*>)(?![^&;]+;)', 'gi'),
			'<b>$1</b>',
		);
	},
	setCaratPosition: (domNode, caretPos) => {
		if (domNode.createTextRange) {
			const range = domNode.createTextRange();
			range.move('character', caretPos);
			range.select();
		} else {
			domNode.focus();
			if (domNode.selectionStart) {
				domNode.setSelectionRange(caretPos, caretPos);
			}
		}
	},
	rtrim: (string) => {
		return string.replace(/\s+$/, '');
	},
	mentionItemSyntax: template('@[<%= screenName %>](id:<%= userId %>)'),
	mentionItemHighlight: template('<span class="mentioned"><%= screenName %></span>'),
	mentionItemNavigate: template('<a class="mentioned-link" id="<%= userId %>"><%= trigger %><%= screenName %></a>'),
	getOffset(selector) {
		const element = document.querySelector(selector);

		if (!element.getClientRects().length) {
			return { top: 0, left: 0 };
		}
		const rect = element.getBoundingClientRect();
		const win = element.ownerDocument.defaultView;
		return {
			top: rect.top + win.pageYOffset,
			left: rect.left + win.pageXOffset,
		};
	},
	getPosition(selector) {
		const element = document.querySelector(selector);
		return {
			top: element.offsetTop,
			left: element.offsetLeft,
		};
	},
};
