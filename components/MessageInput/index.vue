<template>
	<v-text-field v-model="text" @keypress="enter">
		<v-icon slot="append" @click="send">
			mdi-send
		</v-icon>
	</v-text-field>
</template>

<script lang="js">
export default {
	name: 'MessageInput',
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
			if (e.keyCode === 13) {
				this.send();
			}
		},
	},
};
</script>
