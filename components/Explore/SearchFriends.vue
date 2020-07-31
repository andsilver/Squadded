<template>
	<div class="px-2 search-field">
		<v-text-field
			ref="search-text"
			v-model.lazy="searchText"
			class="search-plus"
			:hide-details="true"
			:placeholder="$t('explore_page.search.find_friends')"
			@focus="() => setSearch(true)"
			@input="() => onInput()"
		>
			<v-icon slot="prepend" color="#B8B8BA" size="22">
				sqdi-magnifying-glass-finder
			</v-icon>
		</v-text-field>
		<v-btn v-if="searching" ref="close-btn" class="close-btn" icon @click="() => setSearch(false)">
			<v-icon small color="black">
				mdi-close
			</v-icon>
		</v-btn>
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { ExploreStore, ExploreActions, ExploreMutations } from '~/store/explore';

const { mapState } = createNamespacedHelpers(ExploreStore);

export default {
	data: () => ({
		searchText: null,
		isTyping: false,
	}),
	computed: {
		...mapState([
			'searching',
		]),
	},
	watch: {
		searchText() {
			this.$emit('change', this.searchText);
			this.debounced(() => {
				this.isTyping = false;
				this.$emit('typing', false);
			}, 1000);
		},
		isTyping(value) {
			if (value) {
				return;
			}
			this.$store.dispatch(`${ExploreStore}/${ExploreActions.searchFriends}`, this.searchText);
		},
	},
	methods: {
		debounced (fn, delay) {
			let timerId;
			if (timerId) {
				clearTimeout(timerId);
			}
			timerId = setTimeout(() => {
				fn();
				timerId = null;
			}, delay);
		},
		setSearch(flag) {
			this.$store.commit(`${ExploreStore}/${ExploreMutations.setSearching}`, flag);
			if (!flag) {
				this.searchText = '';
				this.$store.commit(`${ExploreStore}/${ExploreMutations.setFriends}`, null);
			}
		},
		onInput() {
			this.isTyping = true;
			this.$emit('typing', true);
		},
	},
};
</script>

<style lang="scss" scoped>
.search-field {
	box-shadow: 0px 3px 16px 0px #0000000f;
	margin-bottom: 4px;
	position: relative;

	.close-btn {
		position: absolute;
		right: 4px;
		top: 2px;
	}
}
.search-plus {
	&.v-text-field {
		padding-top: 4px;
		padding-bottom: 4px;
		font-size: 3.230vw;
		font-weight: 500;
		width: 100%;
	}
	.v-input__prepend-outer {
		margin-right: 0.615vw;
	}
	&.v-input__append-outer, &.v-input__prepend-outer{
		margin-bottom: 0px;
		margin-top: 0px;
	}
	&.theme--light.v-input:not(.v-input--is-disabled) input {
		color: #B8B8BA;
	}
	&.v-text-field input {
		padding: 0px 2.153vw 0px!important;
		font-size: 3.80vw;
	}
	i.v-icon.sqdi-magnifying-glass-finder {
		font-size: 4.69vw !important;
	}
	.v-input__icon.v-input__icon--clear {
		background: black !important;
	}
	.v-input__control .v-input__append-inner .v-input__icon--clear{
		background: black !important;

		.v-icon{
			color: white;
			font-size: 16px;
		}
	}
}
</style>
