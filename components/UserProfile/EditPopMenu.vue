<template>
	<div>
		<v-menu
			v-model="menu"
			:attach="parentNode"
			absolute
			origin="right top"
			transition="scale-transition"
			:close-on-content-click="false"
			class="edit-settings"
		>
			<template v-slot:activator="{ on }">
				<v-btn ref="avatar-upload-btn" class="edit-icon-sec" icon v-on="on">
					<img src="~assets/img/action-edit.svg" class="edit-icon-image">
				</v-btn>
			</template>

			<v-list class="edit-setting-options two_settings_options">
				<v-list-item class="edit-menu-action edit-setting-option">
					<v-list-item-title class="setting-label action">
						{{ $t(`Update Photo`) }}
						<v-btn icon class="button_edit" @click="menu = false">
							<img src="~assets/img/action-edit.svg" class="edit-icon-image">
						</v-btn>
					</v-list-item-title>
				</v-list-item>
				<v-list-item class="edit-menu-take edit-setting-option" @click="photoUpdate">
					<img src="~assets/img/take-phone.svg" class="take-icon-image">
					<v-list-item-title class="setting-label pushwatchers">
						{{ $t(`Take a Photo`) }}
					</v-list-item-title>
				</v-list-item>
				<v-list-item class="edit-menu-browse edit-setting-option" @click="photoUpdate">
					<img src="~assets/img/take-picture.svg" class="browse-icon-image">
					<v-list-item-title class="setting-label share">
						{{ $t(`Browse Gallery`) }}
					</v-list-item-title>
				</v-list-item>
			</v-list>
		</v-menu>
	</div>
</template>

<script>

export default {
	data: () => ({
		menu: false,
		parentNode: null,
	}),
	mounted() {
		this.parentNode = this.$parent.$el;
	},
	methods: {
		hide() {
			this.showReasonDialog = false;
		},
		photoUpdate() {
			this.menu = false;
			this.$emit('fileUpload');
		},
	},
};
</script>

<style lang="stylus" scoped>
.edit-setting-options
	width 60VW
	padding: 3.84vw 4.61vw 2.76vw
	.edit-setting-option
		padding 0
		&.edit-menu-action
			margin-bottom 4.30vw
			border-bottom none
		&.edit-menu-take
			border-bottom 1px solid #B8B8BA
			padding-bottom 2.53vw
			margin-bottom 2.53vw
		.take-icon-image
			width 3.69vw
			height 5.53vw
			margin-right 1.23vw
		.browse-icon-image
			width 3.69vw
			height 4.53vw
			margin-right 1.23vw
	button.button_edit
		top: 6px
		right 6px
		position fixed
		.edit-icon-image
			width 5.38vw
			height: 5.38vw
	.setting-label
		color #000000
		font-size 3.38vw
		font-weight: 700
		&.action
			position relative
			color #B8B8BA
			font-weight: 400
</style>
