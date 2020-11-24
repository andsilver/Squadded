<template>
	<v-container v-if="socket.isAuth">
		<div>
			<BackBar ref="goback-button" :title="$t('Create')" :close="true" />
			<Tabs ref="tabs" />
			<v-layout column justify-center class="tab-content-section" justify-space-between fill-height>
				<v-layout column>
					<div>
						<UserLink ref="userlink" size="30" :user="user.me" />
					</div>
					<QuestionCard ref="question-card" :background="pane.background">
						<textarea
							ref="question-input"
							v-model="text"
							:style="{
								color: pane.color
							}"
							:class="pane.border === 'black' ? 'white-placeholder' : ''"
							:maxlength="300"
							:placeholder="$t('createDesc.what_question', { user: user.me.screenName })"
						/>
					</QuestionCard>
					<QuestionColorSelect ref="color-select" :selected="background" @select="(v) => pane = v" />
					<div class="bottom-post-sec hide_section mt-8">
						<PublicToggle v-if="!$isGuest()" ref="public-toggle" :public="true" />
					</div>
				</v-layout>
				<div class="public-right-section">
					<Button
						ref="done-button"
						class="post-button"
						:disabled="!text"
						@click.native="create"
					>
						{{ $t('Post') }}
					</Button>
				</div>
			</v-layout>
		</div>
	</v-container>
</template>
<script>
import autosize from 'autosize';
import QuestionCard from '~/components/Posts/Includes/QuestionCard';
import QuestionColorSelect from '~/components/Posts/Includes/QuestionColorSelect';
import Tabs from '~/components/Create/Tabs';
import BackBar from '~/components/Create/BackBar';
import Button from '~/components/common/Button';
import UserLink from '~/components/UserLink';
import PublicToggle from '~/components/Create/PublicToggle';
import { GA_ACTIONS } from '~/consts';
import createPost from '~/mixins/create-post';

export default {
	name: 'NewQuestionPage',
	components: {
		BackBar,
		Button,
		PublicToggle,
		Tabs,
		UserLink,
		QuestionCard,
		QuestionColorSelect,
	},
	mixins: [createPost],
	data: () => ({
		text: '',
		isPublic: false,
		background: 'white',
		pane: {
			background: 'white',
			color: 'black',
			border: 'black',
		},
	}),
	mounted() {
		autosize(this.$refs['question-input']);
	},
	methods: {
		create() {
			const msg = {
				private: this.$isGuest() ? false : !this.$refs['public-toggle'].isPublic,
				text: this.text,
				background: this.pane.background,
				color: this.pane.color,
				type: 'questionPost',
			};
			this.createPost(msg);
			this.$gaAction(GA_ACTIONS.CREATE_POST_QUESTION);
		},
	},
	head: () => ({
		title: 'Create-Question',
	}),
};
</script>

<style lang="scss" scoped>
textarea {
	width: 100%;
	resize: none;
	text-align: center;
	font-size: 14px;
	font-weight: 600;
	overflow: hidden !important;

	&:focus,
	&:active {
		border: none;
		outline: none;
	}

	&::placeholder {
		color: rgba(255, 255, 255, 0.5);
	}
}
textarea.white-placeholder {
	color: black;
	&::placeholder {
		color: rgba(0, 0, 0, 0.5);
	}
}
.public-right-section {
	width: 100%;
	text-align: center;
	bottom: 0px;
	background: #fff;
	z-index: 202;
}
.post-button {
	width: 42.46vw;
	height: 12.3vw !important;
	margin-top: 6.5vw !important;
}
</style>
