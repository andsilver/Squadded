<template>
	<v-tab class="create tab_item">
		<v-menu top offset-y>
			<template v-slot:activator="{ on }">
				<v-btn icon v-on="on">
					<v-icon
						class="tab_icon plus_icon"
					>
						sqdi-plus
					</v-icon>
				</v-btn>
			</template>

			<v-list>
				<v-list-item
					v-for="link in menu"
					:key="link.uri"
				>
					<nuxt-link :to="link.uri">
						{{ $t(link.title) }}
					</nuxt-link>
				</v-list-item>
			</v-list>
		</v-menu>
	</v-tab>
</template>

<script>
export default {
	data: () => ({
		menu: [{
			uri: '/create/outfit',
			title: 'create.outfit',
		}, {
			uri: '/create/poll',
			title: 'create.poll',
		}],
	}),
};
</script>

<style lang="stylus" scoped>
.v-tab
	min-width auto
	padding 0
.create.tab_item .v-btn
	content ""
	z-index 5
	border 2px solid black
	border-radius 10px
	height 45px
	width 45px
	min-width auto

.plus_icon:before
	color black
	font-size .6em !important
	margin-bottom 0
</style>
