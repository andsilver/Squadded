<template>
	<v-tab
		:disabled="!socket.isAuth"
		:to="createPath"
		exact
		class="tab_item"
		@click="toggleMenu"
	>
		<v-menu top offset-y>
			<template v-slot:activator="{ on }">
				<span ref="createTabBtn" class="tab_icon" v-on="on">
					<v-icon>
						sqdi-add-post
					</v-icon>
				</span>
				<span class="tab_text">{{ $t('feed.create') }}</span>
			</template>

			<v-list class="open-add-section">
				<h5>{{ $t('CreateANew') }}</h5>
				<v-list-item
					v-for="link in visiblePosts"
					:key="link.uri"
					:class="$t(link.title)"
					@click.native="() => closeMenu(link.uri)"
				>
					<div class="left-content-sec">
						<img :src="link.images">
					</div>
					<div class="right-content-sec">
						<span class="link-title">
							{{ $t(link.title) }}
						</span>
						<div class="discription">
							{{ $t(link.des) }}
						</div>
					</div>
				</v-list-item>
			</v-list>
		</v-menu>
	</v-tab>
</template>

<script>
import { createNamespacedHelpers, mapState } from 'vuex';
import { visiblePosts } from '~/consts';
import { UserStore } from '~/store/user';

const userState = createNamespacedHelpers(UserStore).mapState;

export default {
	computed: {
		...userState(['me']),
		...mapState([
			'socket',
			'merchant',
		]),
		visiblePosts,
		createPath () {
			return { query: { create: true } };
		},
	},
	created() {
		this.$root.$on('openCreateMenu', () => {
			this.$refs.createTabBtn && this.$refs.createTabBtn.$el && this.$refs.createTabBtn.$el.click();
		});
	},
	methods: {
		toggleMenu (event) {
			const icon = event.target.closest('.tab_icon');
			if (!icon) {
				this.$refs.createTabBtn.click();
			} else {
				this.$root.$emit('overlayToggle', {});
			}
		},
		closeMenu (uri) {
			const { path } = this.$route;
			if (!path.includes('/create/')) {
				sessionStorage.setItem('beforeCreatePath', this.$route.path);
			}
			this.$root.$emit('overlayClose', {});
			this.$router.push(uri);
		},
	},
};
</script>

<style lang="stylus" scoped>
.v-tab
	min-width auto

.tab_text
	position absolute
	font-size 2.76vw
	font-weight 600
	bottom 20%
	color #B8B8BA

.tab_icon
	position relative
	.v-icon:before
		font-size .9em
		color #B8B8BA
		margin-bottom 55%

.v-tab--active
	.tab_icon .v-icon:before,
	.tab_text
		color var(--brand-color)

.v-menu__content.theme--light.v-menu__content--fixed.menuable__content__active {
	min-width: 100% !important;
	width: 100% !important;
	left: 0 !important;
	box-shadow:0 -17px 37px -17px rgba(0, 0, 0, 0.3);
	border-top-right-radius: 8vw;
	border-top-left-radius: 8vw;
	height: auto !important;
	padding-bottom: 10px;
	background-color: transparent;
	bottom: 55px;
	top: auto !important;
	z-index: 199 !important;
}
@media screen and (max-width: 280px){
	.v-menu__content.theme--light.v-menu__content--fixed.menuable__content__active {
		bottom: 50px;
	}
}
.v-list.open-add-section.v-sheet.v-sheet--tile.theme--light {
	padding: 4.893vw 4VW 0;
	padding-bottom: 5.6vw;
	border-radius: 0px !important;
}
.v-list.open-add-section.v-sheet.v-sheet--tile.theme--light h5 {
	color: #B8B8BA;
	font-size: 2.933vw;
	font-weight: 500;
	padding-bottom: 3.826vw;
}
.open-add-section .v-list-item.theme--light .link-title {
	color: #000;
	font-size: 3.466vw;
	font-weight: 700;
	width: 100%;
	display: flex;
	align-items: center;
}
.open-add-section .v-list-item.theme--light {
	padding: 0;
	display: flex;
	align-items :center;
	padding-bottom: 3.280vw;
	border-bottom: 0.4vw solid #DBDBDB;
	padding-top: 3.28vw;
	cursor: pointer;
}
.open-add-section .v-list-item.theme--light.Outfit {
	padding-top: 0px;
}
.discription {
	color: #B8B8BA;
	font-size: 2.80vw;
	font-weight: normal;
}
.left-content-sec {
	padding-right: 4VW;
	height: 5.266vw;
}
.left-content-sec img {
	width:  5.266vw;
	height:  5.266vw;
}
</style>
