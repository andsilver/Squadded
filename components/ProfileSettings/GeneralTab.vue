<template>
	<div v-if="user" class="pa-3">
		<div>
			<label class="input-label" for="email">{{ $t('form.email') }}</label>
			<v-text-field
				id="email"
				ref="email-field"
				v-model="user.email"
				hide-details
				outlined
				dense
			/>
		</div>
		<section class="mt-4">
			<div class="d-flex justify-space-between align-center">
				<label class="input-label" for="phone_number">{{ $t('form.phone_number') }}</label>
				<span class="input-label">{{ $t('form.only_used_for_validation') }}</span>
			</div>
			<v-text-field
				id="phone_number"
				ref="phone-number-field"
				v-model="user.phone"
				hide-details
				outlined
				dense
			/>
		</section>
		<section class="my-4 d-flex">
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
				<div
					ref="language-description"
					class="mt-2 input-label"
				>
					{{ $t('profile_settings.language.description') }}
				</div>
			</div>
		</section>
		<v-divider />
		<section class="my-4 d-flex">
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
				<div
					ref="terms-of-service-description"
					class="mt-2 input-label"
				>
					{{ $t('profile_settings.terms_of_service.description') }}
				</div>
			</div>
		</section>
		<v-divider />
		<section class="my-4 d-flex">
			<div class="mr-3">
				<v-btn icon>
					<v-icon small color="black">
						mdi-bell-outline
					</v-icon>
				</v-btn>
			</div>
			<div class="mt-1 flex-grow-1">
				<div class="d-flex justify-space-between align-center">
					<h5>{{ $t('profile_settings.notifications.title') }}</h5>
					<div class="select-control">
						<v-select
							v-model="user.notification"
							:items="notifications"
							item-text="text"
							item-value="value"
							solo
							flat
							rounded
							hide-details
							color="black"
						/>
					</div>
				</div>
				<div
					ref="notifications-description"
					class="mt-2 input-label"
				>
					{{ $t('profile_settings.notifications.description') }}
				</div>
			</div>
		</section>
		<v-divider />
		<div class="mt-4">
			<div class="d-flex justify-space-between">
				<span class="input-label">{{ $t('profile_settings.feedback') }}</span>
				<span class="input-label">{{ $t('profile_settings.share_your_opinion') }}</span>
			</div>
			<div class="mt-2">
				<v-textarea outlined :rows="3" />
			</div>
		</div>
		<div class="mt-4 py-4 d-flex justify-center">
			<Button ref="save-button" style="width: 100px;">
				{{ $t('Save') }}
			</Button>
		</div>

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
						`1.2 As the provider of the Airbnb Platform, Airbnb does not own, create, sell, resell, provide,
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
	</div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex';
import Button from '~/components/common/Button';
import { UserStore } from '~/store/user';

const { mapState } = createNamespacedHelpers(UserStore);

export default {
	components: {
		Button,
	},
	data: () => ({
		user: null,
		languages: ['english', 'français'],
		notifications: [
			{
				text: '15 minutes',
				value: 15,
			},
		],
		showTerms: false,
	}),
	computed: {
		...mapState(['me']),
	},
	watch: {
		me() {
			this.user = Object.assign({}, this.me);
		},
	},
	mounted() {
		this.user = Object.assign({}, this.me);
		this.user.language = this.languages[0];
		this.user.notification = this.notifications[0].value;
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
		+.v-btn
			margin-left 3.07vw !important
			background-color #fff !important
			border 0.461vw solid #000

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
</style>
