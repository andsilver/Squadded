<template>
	<v-tab :disabled="!socket.isAuth" class="create tab_item" @click="toggleMenu">
		<v-menu top offset-y>
			<template v-slot:activator="{ on }">
				<v-btn ref="createTabBtn" icon v-on="on">
					<v-icon
						class="tab_icon plus_icon"
					>
						sqdi-plus
					</v-icon>
				</v-btn>
			</template>

			<v-list class="open-add-section">
				<h5>{{ $t('CreateANew') }}</h5>
				<v-list-item
					v-for="link in menu"
					:key="link.uri"
					:class="$t(link.title)"
					@click.native="closeMenu"
				>
					<nuxt-link :to="link.uri">
						<div class="left-content-sec">
							<img :src="link.images">
						</div>
						<div class="right-content-sec">
							{{ $t(link.title) }}
							<div class="discription">
								{{ $t(link.des) }}
							</div>
						</div>
					</nuxt-link>
				</v-list-item>
			</v-list>
		</v-menu>
	</v-tab>
</template>

<script>
import { mapState } from 'vuex';

export default {
	data: () => ({
		menu: [{
			uri: '/create/outfit',
			title: 'create.outfit',
			des: 'createDesc.outfit',
			images: require('assets/img/outfit.svg'),
		}, {
			uri: '/create/photo',
			title: 'create.photo',
			des: 'createDesc.photo',
			images: require('assets/img/photo.svg'),
		}, {
			uri: '/create/poll',
			title: 'create.poll',
			des: 'createDesc.poll',
			images: require('assets/img/poll.svg'),
		}],
	}),
	computed: {
		...mapState([
			'socket',
		]),
	},
	created() {
		this.$root.$on('openCreateMenu', () => {
			this.$refs.createTabBtn && this.$refs.createTabBtn.$el && this.$refs.createTabBtn.$el.click();
		});
	},
	methods: {
		toggleMenu () {
			this.$root.$emit('overlayToggle', {});
		},
		closeMenu () {
			this.$root.$emit('overlayClose', {});
		},
	},
};
</script>

<style lang="scss" scoped>
.v-tab{
	min-width: auto;
	padding :0;
}
.v-tabs-bar__content .create.tab_item .v-btn{
	content: "";
	z-index: 5;
	border: 2px solid black;
	border-radius: 10px;
	height: 45px;
	width: 45px;
	min-width:auto;
}
.plus_icon:before{
	color : black;
	font-size : 0.6em !important;
	margin-bottom: 0;
}
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
}
.v-list.open-add-section.v-sheet.v-sheet--tile.theme--light {
    padding: 4.893vw 4VW 0;
}
.v-list.open-add-section.v-sheet.v-sheet--tile.theme--light h5 {
    color: #B8B8BA;
    font-size: 2.933vw;
    font-weight: 500;
    padding-bottom: 3.826vw;
}
.open-add-section .v-list-item.theme--light a {
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
