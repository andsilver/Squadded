<template>
	<v-container v-if="socket.isAuth">
		<h2>
			<GoBackBtn ref="goback-button" />
			{{ $t('poll.create') }}
		</h2>
		<v-layout
			column
			justify-center
			align-center
		>
			<div class="full-width">
				<v-text-field
					ref="text-field"
					v-model="text"
					hide-details
					:placeholder="$t('poll.textPlaceholder')"
				/>
				<Poll
					ref="select-items"
					:item1="item1"
					:item2="item2"
					@click.native="show = true"
				/>
				<section align="center">
					<Button
						ref="done-button"
						:disabled="!complete"
						@click.native="create"
					>
						{{ $t('Create') }}
					</Button>
				</section>
			</div>
		</v-layout>
		<v-dialog v-model="show">
			<ChooseDialog @choose="choose" />
		</v-dialog>
	</v-container>
</template>

<script>
import { mapState } from 'vuex';
import Button from '~/components/common/Button';
import ChooseDialog from '~/components/Poll/chooseDialog';
import GoBackBtn from '~/components/common/GoBackBtn';
import Poll from '~/components/Poll';
import { FeedStore, FeedActions } from '~/store/feed';

export default {
	name: 'NewPollPage',
	components: {
		Button,
		ChooseDialog,
		GoBackBtn,
		Poll,
	},
	data: () => ({
		show: false,
		text: '',
		item1: null,
		item2: null,
	}),
	computed: {
		...mapState([
			'socket',
		]),
		complete () {
			return !!(this.text && this.item1 && this.item2);
		},
	},
	methods: {
		choose (data) {
			this.show = false;
			this.item1 = data[0].item;
			this.item2 = data[1].item;
		},
		create () {
			const { item1, item2, text } = this;
			this.$store.dispatch(`${FeedStore}/${FeedActions.saveItem}`, {
				item1,
				item2,
				text,
				type: 'pollPost',
			});
			this.$router.push('/feed');
		},
	},
};
</script>
