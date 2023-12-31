<template>
	<div ref="comment-input" class="comment-input d-flex align-center ml-2">
		<div class="flex-grow-1 position-relative">
			<div ref="overlay" class="overlay">
				<div ref="overlay-content" class="overlay-content" contenteditable />
			</div>
			<textarea
				ref="input"
				:value="inputValue"
				class="editor"
				:maxlength="300"
				:rows="1"
				@keydown="onKeyDown"
				@click="onClick"
				@blur="onBlur"
				@input="onInput"
			/>
		</div>
		<v-icon
			v-if="showSend"
			class="message-icon align-self-start mx-1"
			@click="send"
		>
			mdi-send
		</v-icon>
		<div v-if="showSquadders && searched && searched.length" class="squadders">
			<div
				v-for="(s, i) of searched"
				:key="i"
				@click="(e) => selectItem(s, i, e)"
			>
				<div
					class="d-flex align-center py-2 pl-5 squadder-item"
					:class="{ active: i === activeItem }"
				>
					<div class="avatar-container">
						<v-img v-if="s.miniAvatar || s.avatar" :src="s.miniAvatar || s.avatar" width="7.69vw" height="7.69vw" />
						<div v-else ref="user-avatar" class="dummy_image" />
					</div>
					<div class="ml-3">
						<div>{{ s.screenName }}</div>
					</div>
				</div>
				<v-divider />
			</div>
		</div>
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import autosize from 'autosize';
import extend from 'lodash/extend';
import reject from 'lodash/reject';
import compact from 'lodash/compact';
import lastIndexOf from 'lodash/lastIndexOf';
import defer from 'lodash/defer';
import { utils, MENTION } from './utils';
import { FeedStore } from '~/store/feed';

const feedState = createNamespacedHelpers(FeedStore).mapState;
const KEY = {
	BACKSPACE: 8,
	TAB: 9,
	RETURN: 13,
	ESC: 27,
	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,
	COMMA: 188,
	SPACE: 32,
	HOME: 36,
	END: 35,
};

export default {
	props: {
		value: {
			type: String,
			default: '',
		},
		forFeed: {
			type: Boolean,
			default: false,
		},
		isPanelOpen: {
			type: Boolean,
			default: false,
		},
		isSelectedPosts: {
			type: Boolean,
			default: false,
		},
	},
	data: () => ({
		mentions: [],
		showSquadders: false,
		inputBuffer: [],
		messageText: '',
		inputValue: '',
		currentDataQuery: '',
		showAutoComplete: false,
		activeItem: -1,
		searched: [],
		top: 0, // Squadders list position
	}),
	computed: {
		...feedState(['squadders']),
		elmInputBox() {
			return this.$refs.input;
		},
		elmMentionsOverlay() {
			return this.$refs['overlay-content'];
		},
		showSend() {
			const isSend = this.inputValue.trim().replace(/\n$/, '').length;
			// if (isSend) {
			// 	this.handlePanel(false);
			// }
			return isSend || this.isSelectedPosts;
		},
	},
	mounted () {
		this.initTextarea();
		this.resetInput(this.value);
	},
	methods: {
		initTextarea() {
			autosize(this.elmInputBox);
		},
		onInput(e) {
			if (e) {
				this.inputValue = e.target.value;
			}
			if (e && e.data) {
				this.inputBuffer.push(e.data.substr(-1));
			}
			this.updateValues();
			this.updateMentionsCollection();

			const triggerCharIndex = lastIndexOf(this.inputBuffer, MENTION); // Returns the last match of the triggerChar in the inputBuffer

			if (triggerCharIndex > -1) {
				let index = this.elmInputBox.selectionStart;

				while (this.inputValue[index] !== MENTION) {
					index--;
				}
				if (index !== 0 && this.inputValue[index - 1] !== ' ' && this.inputValue[index - 1] !== '\n') {
					return this.hideAutoComplete();
				}
				this.currentDataQuery = this.inputBuffer.slice(triggerCharIndex + 1).join(''); // Gets the currentDataQuery
				this.search();
			} else {
				this.hideAutoComplete();
			}
		},
		search() {
			if (!this.squadders) {
				return;
			}
			if (this.currentDataQuery && this.currentDataQuery.length) {
				this.showSquaddersList();
				const results = this.squadders.filter(s =>
					s.screenName.toLowerCase().includes(this.currentDataQuery.toLowerCase()),
				);
				if (!results.length) {
					return this.hideAutoComplete();
				}
				this.searched = results;
			} else {
				this.searched = this.squadders;
				this.showSquaddersList();
			}
		},
		onKeyDown(e) {
			if (e.keyCode === KEY.LEFT || e.keyCode === KEY.RIGHT || e.keyCode === KEY.HOME || e.keyCode === KEY.END) {
				defer(this.resetBuffer);

				if (navigator.userAgent.includes('MSIE 9')) {
					defer(this.updateValues);
				}
				return;
			}

			if (e.keyCode === KEY.BACKSPACE || e.key === 'Backspace') {
				this.inputBuffer = this.inputBuffer.slice(0, -1 + this.inputBuffer.length);
				return true;
			}

			if (e.keyCode === KEY.RETURN && !this.showSquadders) {
				this.send();
				e.preventDefault();
				return false;
			}

			if (!this.showSquadders) {
				return true;
			}

			switch (e.keyCode) {
			case KEY.UP:
				this.activeItem -= 1;
				if (this.activeItem < 0) {
					this.activeItem = this.searched.length - 1;
				}
				e.preventDefault();
				return false;
			case KEY.DOWN:
				this.activeItem += 1;
				if (this.activeItem >= this.searched.length) {
					this.activeItem = 0;
				}
				e.preventDefault();
				return false;
			case KEY.ESC:
				this.showSquadders = false;
				break;
			case KEY.RETURN:
			case KEY.TAB:
				if (this.activeItem !== -1) {
					this.selectItem(this.searched[this.activeItem], this.activeItem);
				}
				e.preventDefault();
				return false;
			}
			return true;
		},
		onClick() {
			this.resetBuffer();
		},
		onBlur() {
			setTimeout(() => this.hideAutoComplete(), 200);
		},
		resetBuffer() {
			this.inputBuffer = [];
		},
		getInputBoxValue() {
			const text = this.inputValue;
			return text;
		},
		hideAutoComplete() {
			this.activeItem = -1;
			this.searched = [];
			this.showSquadders = false;
		},
		updateValues() {
			let syntaxMessage = this.getInputBoxValue();
			this.mentions.forEach((mention) => {
				const textSyntax = utils.mentionItemSyntax(mention);
				syntaxMessage = syntaxMessage.replace(new RegExp(utils.regexpEncode(mention.screenName), 'g'), textSyntax);
			});
			let mentionText = utils.htmlEncode(syntaxMessage);
			this.mentions.forEach((mention) => {
				const formattedMention = extend({}, mention, { screenName: utils.htmlEncode(mention.screenName) });
				const textSyntax = utils.mentionItemSyntax(formattedMention);
				const textHighlight = utils.mentionItemHighlight(formattedMention);
				mentionText = mentionText.replace(new RegExp(utils.regexpEncode(textSyntax), 'g'), textHighlight);
			});

			mentionText = mentionText.replace(/\n/g, '<br />');
			mentionText = mentionText.replace(/ {2}/g, '&nbsp; ');

			this.messageText = syntaxMessage;
			this.elmMentionsOverlay.innerHTML = mentionText;
			setTimeout(() => autosize.update(this.elmInputBox));
		},
		updateMentionsCollection() {
			const inputText = this.getInputBoxValue();
			this.mentions = reject(this.mentions, (mention, index) => {
				return !mention.screenName || !inputText.includes(mention.screenName);
			});
			this.mentions = compact(this.mentions);
		},
		addMention(mention) {
			const currentMessage = this.getInputBoxValue();
			const caretStart = this.elmInputBox.selectionStart;
			const regex = new RegExp('\\' + MENTION + this.currentDataQuery, 'gi');
			let shortestDistance = false;
			let bestLastIndex = false;
			let regexMatch = regex.exec(currentMessage);

			while (regexMatch) {
				if (shortestDistance === false || Math.abs(regex.lastIndex - caretStart) < shortestDistance) {
					shortestDistance = Math.abs(regex.lastIndex - caretStart);
					bestLastIndex = regex.lastIndex;
				}
				regexMatch = regex.exec(currentMessage);
			}
			const startCaretPosition = bestLastIndex - this.currentDataQuery.length - 1;
			const currentCaretPosition = bestLastIndex;

			const start = currentMessage.substr(0, startCaretPosition);
			const end = currentMessage.substr(currentCaretPosition, currentMessage.length);
			const startEndIndex = (start + mention.screenName).length + 1;

			if (!this.mentions.find(object => object.userId === mention.userId)) {
				this.mentions.push(mention); // Add the mention to mentionsColletions
			}
			this.resetBuffer();
			this.currentDataQuery = '';
			this.hideAutoComplete();

			const updatedMessageText = start + mention.screenName + ' ' + end;
			this.inputValue = updatedMessageText; // Set the value to the txt area
			this.updateValues();

			utils.setCaratPosition(this.elmInputBox, startEndIndex);
		},
		selectItem(user, index, e) {
			e && e.preventDefault();
			this.addMention(user);
		},
		resetInput(currentVal) {
			this.mentions = [];
			const mentionText = utils.htmlEncode(currentVal);
			const regex = new RegExp('(' + MENTION + ')\\[(.*?)\\]\\((.*?):(.*?)\\)', 'gi');
			let match;
			let newMentionText = mentionText;
			while ((match = regex.exec(mentionText)) != null) {
				newMentionText = newMentionText.replace(match[0], match[2]);
				this.mentions.push({ userId: match[4], id: match[3], screenName: match[2], trigger: match[1] });
			}
			this.inputValue = newMentionText;
			this.updateValues();
		},
		send() {
			const text = this.messageText.trim();

			if (!text && !this.isSelectedPosts) {
				return;
			}
			this.$emit('send', text);
			this.resetInput('');
		},
		showSquaddersList() {
			const rect = this.$refs['comment-input'].getBoundingClientRect();
			this.bottom = document.documentElement.clientHeight - rect.y + 8;
			this.showSquadders = true;
		},
	},
};
</script>

<style lang="scss" scoped>
.position-relative {
	position: relative;
}
.comment-input {
	.overlay {
		position: absolute;
		width: 100%;
		top: 0;
		color: rgba(0,0,0,.87);
		max-width: 100%;
	}

	.overlay-content {
		width: 100%;
		white-space: pre-wrap;
		word-wrap: break-word;
	}
}
.editor {
	position: relative;
	display: block;
	background: transparent;
	width: 100%;
	color: transparent;
	caret-color: black;

	&:focus {
		outline: none;
	}
}
.editor, .overlay {
	font-size: 12px;
	line-height: 20px;
    font-weight: 500;
}
.squadders {
	box-shadow: -1px -7px 20px 0px rgba(0, 0, 0, 0.22);
	left: -17px;
	border-top: 1px solid #ddd;
	bottom: calc(100% + 4px);
	position: absolute;
	background: white;
	max-height: calc((7.69vw + 18px) * 4);
	width: 100vw;
	z-index: 9;
	box-shadow: -1px -7px 20px 0px rgba(0, 0, 0, 0.22);
	overflow: scroll;
}
.avatar-container {
	border-radius: 50%;
	overflow: hidden;
	height: 7.69vw;
	width: 7.69vw;
}
.squadder-item {
	cursor: pointer;
	&:hover {
		background: #ececec;
	}
	font-size: 12px;
	font-weight: 600;
	color: black;
}
.active {
	background: #ececec;
}
</style>
<style lang="stylus" scoped>
body .v-application .message-icon
	width 24px
	height 24px
	background-color #000
	border-radius 50%
	&::before
		content ''
		background-image url('~assets/img/submit-plane.svg')
		width: 24px
		height: 24px
		background-repeat no-repeat
		background-position 4px
		background-size 14px
.dummy_image
	background-image url('~assets/img/dummy_avater.svg')
	background-position center
	background-size 55%
	background-repeat no-repeat
	width: 7.69vw;
	height: 7.69vw;
	border-radius 50%
	border 0.92vw solid #fff
	background-color #F5F5F5
</style>
<style>
.mentioned {
	color: #fd6256 !important;
	background-color: #fefeff;
}
</style>
