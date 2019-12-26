<template>
	<h3 class="d-flex justify-space-between align-center pa-2">
		<GoBackBtn ref="go-back-btn" />
		<span ref="paired-item-title">{{ $t('pairedItem.title') }}</span>
		<v-btn icon>
			<v-icon>sqdi-share</v-icon>
		</v-btn>
	</h3>
</template>

<script>
import GoBackBtn from '~/components/common/GoBackBtn';

export default {
	components: {
		GoBackBtn,
	},
};
</script>
