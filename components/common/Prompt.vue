<template>
	<v-card>
		<v-card-title>
			{{ text.question }}
		</v-card-title>
		<v-card-text>
			{{ text.description }}
		</v-card-text>
		<v-card-actions class="flex-column">
			<v-divider />
			<v-btn block text color="red" class="confirm" @click="$emit('confirm')">
				Yes
			</v-btn>
			<v-divider />
			<v-btn block text @click="$emit('decline')">
				No{{ text.decline && `, ${text.decline}` }}
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
export default {
	props: {
		text: {
			type: Object,
			required: true,
		},
	},
};
</script>

<style lang="stylus" scoped>
.v-btn
	text-transform none
	&.confirm
		font-weight 900

.v-divider
	width 100%
</style>
