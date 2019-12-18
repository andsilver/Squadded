<template>
	<section class="d-flex">
		<UserLink v-if="userLink" size="7.69vw" :user="me" hide-name class="message-user-image" />
		<v-text-field
			ref="text-field"
			v-model="textValue"
			hide-details
			:placeholder="placeholder"
			solo
			flat
			dense
			background-color="#F4F4F5"
			class="message-input"
			@keydown="keydown"
		>
			<v-icon v-if="textValue.length" slot="append" color="#B8B8BA" size="22" @click="send">
				mdi-send
			</v-icon>
		</v-text-field>
	</section>
</template>

<script lang="js">
import { createNamespacedHelpers, mapState } from 'vuex';
import UserLink from '~/components/UserLink';
import { UserStore } from '~/store/user';

const userState = createNamespacedHelpers(UserStore).mapState;

export default {
	name: 'MessageInput',
	components: {
		UserLink,
	},
	props: {
		action: {
			type: String,
			required: true,
		},
		placeholder: {
			type: String,
			default: '',
		},
		post: {
			type: Object,
			required: true,
		},
		text: {
			type: String,
			default: '',
		},
		userLink: {
			type: Boolean,
			default: false,
		},
	},
	data: () => ({
		textValue: '',
	}),
	computed: {
		...userState([
			'me',
		]),
		...mapState([
			'squad',
		]),
	},
	mounted () {
		this.textValue = this.text;
		this.$refs['text-field'].focus();
	},
	methods: {
		send () {
			const { action, post, textValue } = this;
			this.$store.dispatch(action, {
				post,
				text: textValue,
			});
			this.$emit('send');
			this.textValue = '';
		},
		keydown (e) {
			if (e.keyCode === 13 && this.textValue.length) {
				this.send();
				return;
			}
			if (e.keyCode === 27) {
				this.$emit('cancel');
			}
		},
	},
};
</script>

<style lang="stylus" scoped>
.v-text-field
	padding-top 1px
	font-size 3.23vw
	font-weight 500
.message-input
	background-color #F4F4F5
	border-bottom-right-radius 3.07vw
	border-top-right-radius 3.07vw
	border-top-left-radius 0px
	border-bottom-left-radius 0px
.message-user-image
	background-color #F4F4F5
	border-top-left-radius 3.07vw
	border-bottom-left-radius 3.07vw
</style>
