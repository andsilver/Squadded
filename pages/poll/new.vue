<template>
	<v-layout
		v-if="isVisible"
		column
		justify-center
		align-center
	>
		<div class="full-width">
			<h2>
				<GoBackBtn ref="goback-button" />
				{{ $t('poll.create') }}
			</h2>
			<v-text-field
				ref="text-field"
				v-model="textValue"
				hide-details
				:placeholder="$t('poll.textPlaceholder')"
			/>
			<Poll ref="select-items" />
			<section align="center">
				<Button ref="done-button">
					{{ $t('Done') }}
				</Button>
			</section>
		</div>
	</v-layout>
</template>

<script>
import { mapState } from 'vuex';
import GoBackBtn from '~/components/common/GoBackBtn';
import Button from '~/components/common/Button';
import Poll from '~/components/Poll';

export default {
	components: {
		Button,
		GoBackBtn,
		Poll,
	},
	data: () => ({
		textValue: '',
	}),
	computed: {
		...mapState([
			'socket',
		]),
		isVisible () {
			return !this.socket.isPendingAuth && this.socket.isAuth;
		},
	},
	mounted() {
		if (this.socket.isAuth) {
			this.$store.commit('SET_PENDING', false);
		}
	},
};
</script>
