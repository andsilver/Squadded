<template>
	<section class="d-flex">
		<UserLink size="30" :user="me" hide-name />
		<v-text-field v-model="text" :placeholder="$t('input.placeholder')" @keypress="enter">
			<v-icon v-if="text.length" slot="append" color="#B8B8BA" size="22" @click="send">
				mdi-send
			</v-icon>
		</v-text-field>
	</section>
</template>

<script lang="js">
import { createNamespacedHelpers } from 'vuex';
import UserLink from '~/components/UserLink';

const { mapState } = createNamespacedHelpers('user');

export default {
	name: 'MessageInput',
	components: {
		UserLink,
	},
	props: {
		post: {
			type: Object,
			required: true,
		},
		action: {
			type: String,
			required: true,
		},
	},
	data: () => ({
		text: '',
	}),
	computed: {
		...mapState([
			'me',
		]),
	},
	methods: {
		send () {
			const { action, post, text } = this;
			this.$store.dispatch(action, {
				post,
				text,
			});
			this.$parent.scroll();
			this.text = '';
		},
		enter (e) {
			if (e.keyCode === 13 && this.text.length) {
				this.send();
			}
		},
	},
};
</script>

<style lang="stylus" scoped>
.v-text-field
	padding-top 0
</style>
