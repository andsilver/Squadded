<template>
	<v-container v-if="user && (user.name || user.screenName)">
		<section class="fixed_profile d-flex justify-space-between align-center pa-2" :class="{ slide: isScrolled }">
			<Menu v-if="user.isMe" ref="menu" small @edit="edit" />
			<GoBackBtn v-else ref="go-back-btn" />
			<div class="d-flex align-center">
				<v-avatar class="user_avatar" width="30px" height="30px" min-width="none">
					<v-img :key="user.avatar" :src="user.avatar" />
				</v-avatar>
				<section class="user_info_fixed ml-2">
					<userName class="user_fixed_name" :name="user.screenName" />
				</section>
			</div>
			<div v-if="user.isMe">
				<AddFriendsButton ref="add-user-btn" class="profile-add-user" :dark="false" />
				<v-btn ref="shop-btn" class="profile-shopping-bag" icon small color="black">
					<v-icon small>
						sqdi-shopping-bag
					</v-icon>
				</v-btn>
			</div>
			<Actions v-else :user="user" />
		</section>
		<ProfileToolbar :user="user" />
		<v-layout flex-column>
			<div class="d-flex mt-4" style="flex: 0 0 100px">
				<userAvatar align="center" class="user_avatar mr-4" :avatar="user.avatar" />
				<div class="user-info-section">
					<userName :name="user.screenName" />
					<p class="mt-2 user-bio">
						{{ user.bio }}
					</p>
					<div class="d-flex user-actions">
						<template v-if="user.isMe">
							<Button class="my-squad-btn ml-0 mr-3" @click.native="goToMySquad">
								<img src="~assets/img/my-squad-profile.svg" class="my-squad">
								<span class="ml-1">{{ $t('My Squad') }}</span>
							</Button>
							<OutlineButton class="profile-edit" @click="edit">
								{{ $t('user.edit') }}
							</OutlineButton>
						</template>
						<template v-else>
							<RemoveSquad v-if="isMySquad" ref="my-squad" :user="user" class="remove-squad-btn" />
							<template v-else-if="!meInvited">
								<OutlineButton v-if="isPending || temporaryPending" disabled class="invited-button">
									<img src="~assets/img/invited-icon.svg" class="my-squad">
									<span class="ml-2">{{ $t('invited') }}</span>
								</OutlineButton>
								<Button v-else class="ma-0 invite-btn" style="background: #ffffff; height: 9.23vw; min-height: auto; color: #000000;border: 0.46vw solid #000000;font-size: 2.15vw; letter-spacing: 1.5px;border-radius: 2.5vw;" @click.native="sendInvite">
									<img src="~assets/img/invite-user.svg" class="my-squad">
									<span class="ml-2">{{ $t('invite') }}</span>
								</Button>
							</template>
						</template>
					</div>
					<template v-if="!user.isMe">
						<div v-if="meInvited" ref="invite-text" class="invite-text text-center">
							{{ $t('user.invitation.invited_text') }}
						</div>
						<div v-if="showInvitation" class="postion-relative my-4 d-flex align-center pl-1">
							<Invitation ref="invitation" :user="user" :me="me" @deny="deny" />
						</div>
					</template>
				</div>
			</div>

			<v-tabs v-model="tabs" class="px-1 mt-4 user-profile-tabs" fixed-tabs centered @change="keepTab">
				<v-tab class="tabs pt-3">
					<span style="text-transform: capitalize;">{{ $t('Posts') }}</span>
				</v-tab>
				<v-tab class="tabs pt-3">
					<span style="text-transform: capitalize">{{ $t('Wishlist') }}</span>
				</v-tab>
			</v-tabs>
			<v-tabs-items v-model="tabs" touchless>
				<v-tab-item class="mt-3">
					<Blog :is-me="user.isMe" />
				</v-tab-item>
				<v-tab-item>
					<Whishlist :is-me="user.isMe" />
				</v-tab-item>
			</v-tabs-items>
		</v-layout>
		<NotSignedInDialog v-if="!socket.isAuth" ref="not-signed-in-dialog" :user="user" />
	</v-container>
</template>

<script>
import { createNamespacedHelpers, mapState } from 'vuex';
import ProfileToolbar from './ProfileToolbar';
import userAvatar from './userAvatar';
import userName from './userName';
import Invitation from './Invitation';
import Menu from './Menu';
import Actions from './Actions';
import { UserStore, UserMutations } from '~/store/user';
import { prefetch } from '~/helpers';
import Blog from '~/components/Blog';
import Whishlist from '~/components/Whishlist';
import NotSignedInDialog from '~/components/LandingPost/NotSignedInDialog';
import Button from '~/components/common/Button';
import OutlineButton from '~/components/common/OutlineButton';
import RemoveSquad from '~/components/common/RemoveSquad';
import { fetchUser } from '~/services/user';
import { tokenExist } from '~/utils/isAuth';
import GoBackBtn from '~/components/common/GoBackBtn';
import AddFriendsButton from '~/components/common/AddFriendsButton';

const userState = createNamespacedHelpers(UserStore).mapState;

export default {
	name: 'User',
	components: {
		userAvatar,
		userName,
		Invitation,
		ProfileToolbar,
		Blog,
		Whishlist,
		NotSignedInDialog,
		Button,
		OutlineButton,
		Actions,
		GoBackBtn,
		RemoveSquad,
		Menu,
		AddFriendsButton,
	},
	asyncData({ store, params, redirect, query }) {
		if (!params.id) {
			return;
		}
		if (params.id === store.state.user.me.userId) {
			redirect('/me');
		}
		if (!tokenExist()) {
			return fetchUser(params.id).then(({ user }) => {
				store.commit(`${UserStore}/${UserMutations.setOther}`, user);
			});
		}
		return prefetch({
			guid: params.id,
			mutation: `${UserStore}/${UserMutations.setOther}`,
			store,
			type: 'fetchUser',
		});
	},
	data: () => ({
		userId: null,
		tabs: 0,
		isScrolled: false,
		invite: false,
		show_notification: false,
		blog: null,
		wishlist: null,
		temporaryPending: false,
	}),
	computed: {
		...mapState(['socket']),
		...userState(['me', 'other']),
		user() {
			return this.userId ? this.other : this.me;
		},
		squadPossible() {
			if (!this.userId) {
				return false;
			}
			const squad = this.other.squad;
			return squad && squad.exists;
		},
		isMySquad() {
			return this.squadPossible && !this.other.squad.pending;
		},
		isPending() {
			return this.squadPossible && this.other.squad.pending;
		},
		isInvitee() {
			return this.isPending && this.other.squad.invitee;
		},
		showInvitation() {
			if (!this.userId) {
				return false;
			}
			if (this.squadPossible) {
				if (!this.isPending) {
					return false;
				}
				return !this.isInvitee;
			}
			return this.invite;
		},
		meInvited() {
			return (this.isPending && !this.isInvitee) || (!this.squadPossible && this.invite);
		},
	},
	created() {
		if (this.$route.hash === '#wishlist') {
			this.tabs = 1;
		}
		if (this.$route.hash === '#follow') {
			this.promptFollow();
		}
	},
	mounted() {
		this.userId = this.$route.params.id;
		this.invite = !!this.$route.query.invite;
		this.bindScroll();
	},
	methods: {
		bindScroll() {
			window.addEventListener('scroll', this.scrolled.bind(this));
		},
		keepTab() {
			this.$router.push({ hash: this.tabs ? 'wishlist' : '' });
		},
		scrolled(e) {
			// TODO calc actual height to tabs instead const
			this.isScrolled = !!(window.scrollY > 350);
		},
		async promptFollow() {
			await this.user;
			this.$root.$emit('prompt', {
				text: { question: this.$t('user.promptFollow', [this.user.name]) },
				confirm: () => {
					this.$refs['follow-btn'].toggleFollow(true);
				},
			});
		},
		edit() {
			this.$router.push('/profile-settings');
		},
		toggleNotification() {
			this.show_notification = !this.show_notification;
		},
		deny() {
			this.invite = false;
		},
		sendInvite() {
			if (!this.socket.isAuth) {
				return this.$router.push('/');
			}
			this.temporaryPending = true;
			this.$ws.sendObj({
				type: 'inviteSquad',
				targetUserId: this.user.userId,
			});
		},
		goToMySquad() {
			this.$router.push('/my/mysquad');
		},
	},
	head() {
		return {
			title: this.userId ? 'UserProfile-Main' : 'MyProfile-Main',
		};
	},
};
</script>

<style scoped lang="stylus">
.tabs {
	padding-bottom: 6%;
	border-bottom: 2px solid rgba(0, 0, 0, 0.1);
	font-size: 4.3vw;
	font-weight: 500;
	color: #b8b8ba;
	font-weight: 600;
}

.user_info {
	background-color: transparent;
	margin-top: 5.5vh;
}

.v-tabs >>> .v-tabs-slider
	color var(--brand-color)

.v-tab--active {
	color: var(--brand-color);
	background-color: white;

	&:before {
		background-color: white;
	}
}

.profile_background_image {
	position: absolute;
	width: 100%;
	left: 0;
	top: 0;
}
.background_shadow {
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	background: linear-gradient(0deg, rgba(0, 0, 0, 0.6) 0%, rgba(255, 255, 255, 0) 75%);
}

.fixed_profile {
	position: fixed;
	top: -80px;
	left: 0;
	width: 100%;
	z-index: 10;
	border-bottom: 1px solid rgba(112, 112, 112, 0.3);
	background-color: #fff;
	transition-property: top;
	transition-duration: 0.1s;

	&.slide {
		top: 0;
	}
}

.user_fixed_name {
	font-size: 4.30vw;
}

.user_info_fixed {
	flex-grow: 1;
	padding-top: 1.5%;
}

.fixed_follow_btn {
	width: 30%;
	margin-top: 1.5%;
	height: 35px;
	padding: 0;
	margin-left: auto;
}

.fixed_follow_btn span {
	font-size: 0.75em;
}
.invite-text {
	background: #f5f5f5;
	padding: 10px 12px;
	color: black;
	font-size: 12px;
	font-weight: 600;
	border-radius: 16px;
}
.postion-relative {
	position: relative;
}

.user-actions {
	.v-btn {
		width: 25.38vw;
		height: 9.23vw;
		min-height: auto;
		border-radius: 3.07vw;
	}

	.my-squad-btn {
		background-color: #fd6256 !important;
		letter-spacing: 1.2px !important;
		padding: 0px !important;
		font-size: 2.15vw;
	}

	.remove-squad-btn >>> .v-btn {
		border-radius: 10px !important;
	}
}
.user-info-section {
	margin-top: 2.33vw;
}
p.mt-2.user-bio {
    font-size: 3.84vw;
    line-height: 4.92vw;
	overflow: hidden;
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
}
.profile-shopping-bag .sqdi-shopping-bag {
	font-size: 6.46vw !important;
}
img.my-squad {
    width: 2.78vw;
}
.user-profile-tabs {
	z-index 1
}
</style>
