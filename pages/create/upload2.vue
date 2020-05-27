<template>
	<v-container v-if="socket.isAuth" grow>
		<div class="upload-main-sec">
			<BackBar ref="goback-bar" :title="$t('Create')" :close="true" />
			<Tabs :active="1" />
			<v-layout column grow class="mt-3">
				<LargeButton
					:img="require('@/assets/img/gallery.svg')"
					:label="$t('create.gallery')"
					class="post-upload"
					@click.native="$router.push('/create/photo')"
				/>
				<LargeButton
					:img="require('@/assets/img/video-upload.svg')"
					:label="$t('create.socialVideo')"
					class="post-upload video"
					@click.native="$router.push('/create/video')"
				/>
			</v-layout>
		</div>
	</v-container>
</template>

<script>
import { mapState } from 'vuex';
import LargeButton from '~/components/common/LargeButton';
import BackBar from '~/components/common/BackBar';
import Tabs from '~/components/Create/Tabs';

export default {
	components: {
		BackBar,
		LargeButton,
		Tabs,
	},
	computed: {
		...mapState([
			'socket',
		]),
	},
};
</script>
