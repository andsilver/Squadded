<template>
	<div v-if="user" class="pa-3">
		<section class="my-6 d-flex">
			<div class="mr-3">
				<v-btn icon>
					<v-icon small color="black">
						mdi-spellcheck
					</v-icon>
				</v-btn>
			</div>
			<div class="mt-1 flex-grow-1">
				<div class="d-flex justify-space-between align-center">
					<h5>
						{{ $t('profile_settings.language.title') }}
					</h5>
					<div class="select-control">
						<v-select
							v-model="user.language"
							:items="languages"
							solo
							flat
							rounded
							hide-details
						/>
					</div>
				</div>
			</div>
		</section>
		<v-divider />
		<section class="my-6 d-flex">
			<div class="mr-3">
				<v-btn icon>
					<v-icon small color="black">
						mdi-file-document
					</v-icon>
				</v-btn>
			</div>
			<div class="mt-1 flex-grow-1">
				<div class="d-flex justify-space-between align-center">
					<h5>{{ $t('profile_settings.terms_of_service.title') }}</h5>
					<v-btn
						ref="read-terms"
						rounded
						depressed
						small
						style="text-transform: lowercase;"
						@click="showTerms = true"
					>
						{{ $t('profile_settings.read') }}
					</v-btn>
				</div>
			</div>
		</section>
		<v-divider />
		<div class="mt-4">
			<div class="d-flex align-center justify-space-between">
				<span ref="feedback-label" class="input-label" :class="{ isError }">{{ $t('profile_settings.feedback') }}</span>
				<v-btn ref="submit-btn" small text color="#fd6256" @click="submit">
					{{ $t('profile_settings.submit') }}
				</v-btn>
			</div>
			<div class="mt-2">
				<v-textarea ref="feedback-field" v-model="feedback" outlined :rows="3" hide-details />
			</div>
			<div class="mt-2 input-label" style="font-size: 12px">
				{{ $t('profile_settings.feedback_warning') }}
			</div>
		</div>
		<section class="my-4 d-flex align-center">
			<div class="mr-3">
				<v-btn ref="sign-out-button" icon @click="showSignoutDialog = true">
					<v-icon color="#fd6256">
						mdi-power
					</v-icon>
				</v-btn>
			</div>
			<div class="flex-grow-1">
				<span class="action-button">
					{{ $t('profile_settings.signout.button') }}
				</span>
			</div>
		</section>
		<section class="mt-4 mb-8 d-flex align-center">
			<div class="mr-3">
				<v-btn ref="delete-account-button" icon @click="showDeleteAccountDialog = true">
					<v-icon color="black">
						mdi-close
					</v-icon>
				</v-btn>
			</div>
			<div class="flex-grow-1">
				<span class="action-button">
					{{ $t('profile_settings.delete_account') }}
				</span>
			</div>
		</section>
		<!-- <div class="mt-4 py-4 d-flex justify-center">
			<Button ref="save-button" style="width: 100px;" @click.native="save">
				{{ $t('Save') }}
			</Button>
		</div> -->

		<v-dialog v-model="showTerms" content-class="report-dialog">
			<v-card>
				<v-card-title class="card-title">
					{{ $t('profile_settings.terms_of_service.title') }}
					<v-btn icon class="close-dialog" @click.native="showTerms = false">
						<v-icon size="3.69vw">
							sqdi-close-cross
						</v-icon>
					</v-btn>
				</v-card-title>
				<v-card-text>
					<div>Last Updated: November 1, 2019</div>
					<h4 class="my-4">
						1. Scope of Services
					</h4>
					<p>
						1.1 The Airbnb Platform is an online marketplace that enables registered users (“Members”)
						and certain third parties who offer services (Members and third parties who offer services
						are “Hosts” and the services they offer are “Host Services”) to publish such Host Services
						on the Airbnb Platform (“Listings”) and to communicate and transact directly with Members
						that are seeking to book such Host Services (Members using Host Services are “Guests”). Host
						Services may include the offering of vacation or other properties for use ("Accommodations"),
						single or multi-day activities in various categories (“Experiences”), access to unique events
						and locations (“Events”), and a variety of other travel and non-travel related services.
					</p>
					<p>
						1.2 As the provider of the Airbnb Platform, Airbnb does not own, create, sell, resell, provide,
						control, manage, offer, deliver, or supply any Listings or Host Services, nor is Airbnb an
						organiser or retailer of travel packages under Directive (EU) 2015/2302. Hosts alone are responsible
						for their Listings and Host Services. When Members make or accept a booking, they are entering into
						a contract directly with each other. Airbnb is not and does not become a party to or other
						participant in any contractual relationship between Members, nor is Airbnb a real estate broker or
						insurer. Airbnb is not acting as an agent in any capacity for any Member, except as specified in
						the Payments Terms.
					</p>
				</v-card-text>
				<v-card-actions class="d-flex justify-center card-action">
					<Button class="px-12" @click.native="showTerms = false">
						{{ $t('Close') }}
					</Button>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog v-model="showSignoutDialog" content-class="report-dialog">
			<v-card>
				<v-card-title class="card-title">
					{{ $t('profile_settings.signout.button') }}
					<v-btn icon class="close-dialog" @click.native="showSignoutDialog = false">
						<v-icon size="3.69vw">
							sqdi-close-cross
						</v-icon>
					</v-btn>
				</v-card-title>
				<v-card-text class="report-options">
					<span class="delete-text">{{ $t('profile_settings.signout.confirm') }}</span>
				</v-card-text>
				<v-card-actions class="d-flex justify-center card-action">
					<Button class="skip-button flex-grow-1" :active="false" @click.native="showSignoutDialog = false">
						{{ $t('Cancel') }}
					</Button>
					<Button ref="confirm-signout" class="flex-grow-1" @click.native="signout">
						{{ $t('profile_settings.signout.button') }}
					</Button>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog v-model="showDeleteAccountDialog" content-class="report-dialog">
			<v-card>
				<v-card-title class="card-title">
					{{ $t('profile_settings.delete_account') }}
					<v-btn icon class="close-dialog" @click.native="showDeleteAccountDialog = false">
						<v-icon size="3.69vw">
							sqdi-close-cross
						</v-icon>
					</v-btn>
				</v-card-title>
				<v-card-text class="text-center px-2 black--text font-weight-medium">
					{{ $t('profile_settings.delete_confirm') }}
				</v-card-text>
				<v-card-actions class="d-flex justify-center card-action">
					<Button class="flex-grow-1 skip-button" :active="false" @click.native="signout">
						{{ $t('profile_settings.signout.button') }}
					</Button>
					<Button class="flex-grow-1 delete-button" @click.native="deleteAccount">
						<v-icon color="white" small>
							mdi-close
						</v-icon>
						<span class="ml-1">
							{{ $t('Delete') }}
						</span>
					</Button>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog v-model="showDeletedDialog" content-class="report-dialog" persistent>
			<v-card>
				<v-card-title class="card-title">
					{{ $t('profile_settings.delete_account') }}
					<v-btn icon class="close-dialog" @click.native="closeDeletedDialog">
						<v-icon size="3.69vw">
							sqdi-close-cross
						</v-icon>
					</v-btn>
				</v-card-title>
				<v-card-text class="text-center px-2 black--text font-weight-medium">
					<span>{{ $t('profile_settings.deleted_statement.first') }}</span>
					<strong> support@squadded.co </strong>
					<span>{{ $t('profile_settings.deleted_statement.second') }}</span>
				</v-card-text>
				<v-card-actions class="d-flex justify-center card-action">
					<Button class="px-12" @click.native="closeDeletedDialog">
						{{ $t('Close') }}
					</Button>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex';
import Button from '~/components/common/Button';
import { UserStore } from '~/store/user';
import { NotificationStore, NotificationMutations } from '~/store/notification';
import { NOTIFICATIONS } from '~/consts/notifications';
import { signOut } from '~/plugins/init/ws';

const { mapState } = createNamespacedHelpers(UserStore);

export default {
	components: {
		Button,
	},
	data: () => ({
		user: null,
		languages: [
			{
				text: 'english',
				value: 'en',
			}, {
				text: 'français',
				value: 'fr',
			},
		],
		notifications: [
			{
				text: '15 minutes',
				value: 15,
			},
		],
		showTerms: false,
		showSignoutDialog: false,
		showDeleteAccountDialog: false,
		showDeletedDialog: false,
		editing: false,
		submitted: false,
		feedback: '',
	}),
	computed: {
		...mapState(['me']),
		isError () {
			return this.submitted && !this.feedback;
		},
	},
	watch: {
		me() {
			this.user = Object.assign({}, this.me);
		},
		user: {
			deep: true,
			handler() {
				const {
					notification,
					...pure
				} = this.user;
				this.editing = Object.keys(pure).some(k => pure[k] !== this.me[k]);
			},
		},
	},
	mounted() {
		this.user = Object.assign({}, this.me);
		this.user.language = this.user.language || this.languages[0].value;
		this.user.notification = this.notifications[0].value;
	},
	methods: {
		signout () {
			sessionStorage.clear();
			signOut(this.$store, this.$router);
		},
		deleteAccount () {
			this.showDeletedDialog = true;
			this.showDeleteAccountDialog = false;
		},
		closeDeletedDialog () {
			this.showDeletedDialog = false;
			this.signout();
		},
		submit () {
			this.submitted = true;
			if (!this.feedback) {
				return;
			}
			this.$ws.sendObj({
				type: 'feedbackPost',
				feedback: this.feedback,
			});
			const message = {
				type: NOTIFICATIONS.ALERT,
				text: this.$t('profile_settings.submitted_notification'),
				ts: Date.now(),
				_id: Date.now(),
			};
			this.$store.commit(
				`${NotificationStore}/${NotificationMutations.add}`,
				message,
			);
			this.feedback = '';
			this.submitted = false;
		},
	},
};
</script>
<style lang="stylus" scoped>
section .v-btn
	background-color rgba(218, 217, 221, 0.3) !important
	color black
	font-weight 600

.input-label
	color #9e9e9e
	font-weight 500
	font-size 14px

.action-button
	color black
	font-size 14px
	font-weight 600

.select-control >>> .v-input
	.v-input__control
		min-height 0 !important

	.v-input__slot
		margin-bottom 0
		padding 0 4px 0 12px
		background-color #ececec !important
		height 28px
		font-weight 600
		font-size 0.75rem

	.v-select__selections
		color black

	max-width 120px

.card-action
	padding 6.15vw 4.53vw
	.v-btn
		height 12.30vw
		font-size 2.61vw
	.skip-button
		margin-left 3.07vw !important
		background-color #fff !important
		border 0.461vw solid #000
		color black
	.delete-button
		background-color #fd6256 !important

.v-dialog > .v-card > .v-card__title.card-title
	justify-content center
	font-size 4.30vw
	font-weight 700
	padding-bottom 25px
	position relative
	.close-dialog
		position absolute
		right 15px

.v-card__text *
	color black

.isError
	color #fd6256
</style>
