<template>
	<v-container class="my-squad">
		<BackBar />
		<MySquad class="px-1 mt-2" />
	</v-container>
</template>

<script>
import MySquad from '~/components/Subscribers/MySquad';
import BackBar from '~/components/Subscribers/BackBar';

export default {
	components: {
		MySquad,
		BackBar,
	},
};
</script>
