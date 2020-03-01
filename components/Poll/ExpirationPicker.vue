<template>
	<section>
		<v-row class="expire-section">
			<v-col cols="1">
				<div class="timer-image" />
			</v-col>
			<v-col cols="6" align="left">
				<label class="expire-in">{{ $t('poll.expiration') }}</label>
			</v-col>
			<v-col cols="4">
				<v-select
					v-model="defaultItem"
					:items="items"
					item-text="label"
					item-value="key"
					:hide-details="true"
					:menu-props="{ top: true }"
					class="expire-custom-select"
					@change="switchDate(`${defaultItem}`)"
				>
					<template slot="selection" slot-scope="data">
						<span class="expire-option">{{ $t(`expiration._${data.item.label}`) }}</span>
					</template>
					<template slot="item" slot-scope="data">
						<span class="expire-option">{{ $t(`expiration._${data.item.label}`) }}</span>
					</template>
				</v-select>
			</v-col>
		</v-row>
		<label class="resultnote">{{ $t('poll.resultNote') }}</label>
	</section>
</template>

<script>
export default {
	components: {
	},
	data: () => ({
		selected: 2,
		expiration: 60 * 60 * 1000 * 24,
		defaultItem: '',
		items: [
			{ label: '15m', amount: 15, interval: 'm', key: 0 },
			{ label: '1h', amount: 1, interval: 'h', key: 1 },
			{ label: '1d', amount: 1, interval: 'd', key: 2 },
			{ label: '3d', amount: 3, interval: 'd', key: 3 },
			{ label: '7d', amount: 7, interval: 'd', key: 4 },
		],
	}),
	computed: {
		date () {
			const m = window.moment();
			const selectedObj = this.items[this.selected];
			const amount = parseInt(selectedObj.amount);
			const interval = selectedObj.interval;
			return m.add(amount, interval).valueOf();
		},
	},
	created () {
		this.defaultItem = this.items[this.selected];
	},
	methods: {
		switchDate (i) {
			this.selected = i;
			const item = this.items[i];
			const m = 1000 * 60;
			const unit = {
				m,
				h: m * 60,
				d: m * 60 * 24,
			};
			this.expiration = item.amount * unit[item.interval];
		},
	},
};
</script>
<style lang="css" scoped>
.row.expire-section {
    margin: 0;
}
img.logo {
    width: 8.307vw;
    height: 8.307vw;
}
.row.expire-section .col {
    padding: 0;
}
.row.expire-section .col.col.col-4 {
    max-width: 23.3vw;
}
.row.expire-section .col.col-6 {
    margin-left: 4.61vw;
	margin-right: 9.9vw;
}
label.expire-in {
    color: #000000;
    font-weight: 700;
    font-size: 3.23vw;
}
.row.expire-section .col.col-4 .v-text-field{
	margin:0;
	padding:0;
}
label.resultnote {
    color: #B8B8BA;
    font-size: 3.230vw;
	margin-left: 12.91vw;
	display: block;
}
.timer-image{
	background-image:url('~assets/img/expire.svg');
	background-size:cover;
	height: 8.3vw;
	width: 8.3vw;
}
.v-input.search-plus input {
    font-size: 3.230vw;
}
span.expire-option {
    font-size: 3.23vw;
    font-weight: 700;
    line-height: 6.153vw;
}
.poll-expiration {
	padding-bottom: 3.93vw;
	border-bottom: 0.46vw solid #DBDBDB;
}
</style>
