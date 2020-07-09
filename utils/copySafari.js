export const copySafari = (textToCopy) => {
	let textArea;

	function createTextArea(text) {
		textArea = document.createElement('textArea');
		textArea.readOnly = true;
		textArea.contentEditable = true;
		textArea.value = text;
		document.body.appendChild(textArea);
	}

	function selectText() {
		const range = document.createRange();
		range.selectNodeContents(textArea);
		const selection = window.getSelection();
		selection.removeAllRanges();
		selection.addRange(range);
		textArea.setSelectionRange(0, 999999);
	}

	function copyTo() {
		document.execCommand('copy');
		document.body.removeChild(textArea);
	}

	createTextArea(textToCopy);
	selectText();
	copyTo();
};
