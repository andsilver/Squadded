<template>
	<v-container v-if="socket.isAuth">
		<BackBar ref="goback-button" :title="$t('poll.create')" />
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
				<ExpirationPicker ref="expiration" />
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
import ExpirationPicker from '~/components/Poll/ExpirationPicker';
import ChooseDialog from '~/components/Poll/chooseDialog';
import BackBar from '~/components/common/BackBar';
import Poll from '~/components/Poll';
import { FeedStore, FeedMutations } from '~/store/feed';
import { PostStore, PostActions } from '~/store/post';

export default {
	name: 'NewPollPage',
	components: {
		BackBar,
		Button,
		ExpirationPicker,
		ChooseDialog,
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
		async create () {
			const { item1, item2, text } = this;
			const msg = {
				item1,
				item2,
				expiration: this.$refs.expiration.date,
				text,
				type: 'pollPost',
			};
			const post = await this.$store.dispatch(`${PostStore}/${PostActions.saveItem}`, msg);
			this.$store.commit(`${FeedStore}/${FeedMutations.addItem}`, post);
			this.$router.push('/feed');
		},
	},
};
</script>
