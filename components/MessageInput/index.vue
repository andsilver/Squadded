<template>
	<section class="d-flex">
		<UserLink v-if="userLink" size="30" :user="me" hide-name />
		<v-text-field
			ref="text-field"
			v-model="textValue"
			hide-details
			:placeholder="placeholder"
			@keydown="keydown"
		>
			<v-icon v-if="textValue.length" slot="append" color="#B8B8BA" size="22" @click="send">
				mdi-send
			</v-icon>
		</v-text-field>
	</section>
</template>

<script lang="js">
import { createNamespacedHelpers } from 'vuex';
import UserLink from '~/components/UserLink';
import { UserStore } from '~/store/user';

const { mapState } = createNamespacedHelpers(UserStore);

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
		...mapState([
			'me',
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
	padding-top 0
	font-size 10px
</style>
