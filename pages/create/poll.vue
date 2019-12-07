<template>
	<v-container v-if="socket.isAuth">
		<BackBar ref="goback-button" :title="$t('Create')" />
		<Tabs />
		<v-layout
			column
			justify-center
			align-center
		>
			<v-text-field
				ref="search-text"
				v-model="searchText"
				class="search-plus"
				hide-details
				:placeholder="$t('Search')"
			>
				<v-icon slot="prepend" color="#B8B8BA" size="22">
					sqdi-magnifying-glass-finder
				</v-icon>
			</v-text-field>
			<div class="d-flex">
				<SelectItems
					ref="select-item1"
					class="select-item"
					:max-count="1"
					:exclude="item2"
					@select="(items) => {item1 = items[0]}"
				/>
				<span>vs</span>
				<SelectItems
					ref="select-item2"
					class="select-item"
					:max-count="1"
					:exclude="item1"
					@select="(items) => {item2 = items[0]}"
				/>
			</div>
			<span v-if="!item1 && !item2" class="note">{{ $t('poll.createNote') }}</span>
			<ExpirationPicker ref="expiration" />
			<v-text-field
				ref="text-field"
				v-model="text"
				hide-details
				:placeholder="$t('poll.textPlaceholder')"
			>
				<v-avatar
					slot="prepend"
					min-width="none"
					height="22.5pt"
					width="22.5pt"
				>
					<v-img
						:src="avatar"
					/>
				</v-avatar>
			</v-text-field>
			<section align="center">
				<Button
					ref="done-button"
					:disabled="!complete"
					@click.native="create"
				>
					{{ $t('Create') }}
				</Button>
			</section>
		</v-layout>
	</v-container>
</template>

<script>
import { mapState } from 'vuex';
import BackBar from '~/components/common/BackBar';
import Button from '~/components/common/Button';
import SelectItems from '~/components/Create/SelectItems';
import Tabs from '~/components/Create/Tabs';
import ExpirationPicker from '~/components/Poll/ExpirationPicker';
import { FeedStore, FeedMutations } from '~/store/feed';
import { PostStore, PostActions } from '~/store/post';

export default {
	name: 'NewPollPage',
	components: {
		BackBar,
		Button,
		ExpirationPicker,
		SelectItems,
		Tabs,
	},
	data: () => ({
		item1: null,
		item2: null,
		searchText: '',
		text: '',
	}),
	computed: {
		...mapState([
			'socket',
		]),
		complete () {
			return !!(this.text && this.item1 && this.item2);
		},
		avatar () {
			return this.$store.state.user.me.avatar;
		},
	},
	methods: {
		async create () {
			const { item1, item2, text } = this;
			const msg = {
				item1,
				item2,
				expires: this.$refs.expiration.date,
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

<style lang="stylus" scoped>
.v-input
	width 100%
.d-flex span
	align-self center
.select-item
	width 50%
</style>
