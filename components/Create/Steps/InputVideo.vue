<template>
	<section>
		<v-text-field
			ref="video-link"
			v-model.lazy="inputLink"
			:placeholder="$t('video.inputLinkPlaceholder')"
		>
			<v-icon ref="link-icon" slot="append">
				mdi-link
			</v-icon>
		</v-text-field>
		<VideoView
			ref="video-preview"
			:video-link="inputLink"
			@done="done"
			@fail="fail"
		/>
		<BottomFixed>
			<NextButton
				:disabled="!linkIsValid"
				@click.native="next"
			/>
		</BottomFixed>
	</section>
</template>

<script>
import BottomFixed from '~/components/Create/BottomFixed';
import NextButton from '~/components/Create/NextButton';
import VideoView from '~/components/common/VideoView';

export default {
	components: {
		BottomFixed,
		NextButton,
		VideoView,
	},
	data: () => ({
		inputLink: '',
		linkIsValid: false,
	}),
	methods: {
		done() {
			this.linkIsValid = !!this.inputLink;
		},
		fail() {
			this.linkIsValid = false;
			console.log('Loading faild');
		},
		next() {
			this.$emit('next', this.inputLink);
		},
	},
};
</script>
