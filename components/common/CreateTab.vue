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

			<v-list class="open-add-section">
				<h5>{{ $t('CreateANew') }}</h5>
				<v-list-item
					v-for="link in menu"
					:key="link.uri"
				>
					<div class="left-content-sec">
						<img :src="link.images">
					</div>
					<div class="right-content-sec">
						<nuxt-link :to="link.uri">
							{{ $t(link.title) }}
							<div class="discription">
								{{ $t(link.des) }}
							</div>
						</nuxt-link>
					</div>
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
			des: 'Pair 2-4 items in a single post',
			images: require('assets/img/outfit.svg'),
		}, {
			uri: '',
			title: 'create.photo',
			des: 'Add a photo and tag items on it',
			images: require('assets/img/photo.svg'),
		}, {
			uri: '/create/poll',
			title: 'create.poll',
			des: 'Ask your followers to vote between 2 items',
			images: require('assets/img/poll.svg'),
		}],
	}),
};
</script>

<style lang="scss">
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
    padding-bottom: 1.07vw;
}
.open-add-section .v-list-item.theme--light {
    padding: 0;
    display: flex;
	align-items :center;
    padding-bottom: 3.280vw;
    border-bottom: 0.4vw solid #DBDBDB;
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
