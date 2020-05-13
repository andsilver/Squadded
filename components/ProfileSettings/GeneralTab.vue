<template>
	<div v-if="user" class="pa-4">
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
					<h5 class="title-text">
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
					<h5 class="title-text">
						{{ $t('profile_settings.terms_of_service.title') }}
					</h5>
					<v-btn
						ref="read-terms"
						rounded
						depressed
						small
						style="text-transform: lowercase;"
						@click="showTermsRead"
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
				<v-btn
					ref="submit-btn"
					small
					text
					color="#FD6256"
					style="font-size: 3.07vw; font-weight: 600;"
					@click="submit"
				>
					{{ $t('profile_settings.submit') }}
				</v-btn>
			</div>
			<div class="mt-1">
				<v-textarea
					ref="feedback-field"
					v-model="feedback"
					class="feedback-field-textarea"
					outlined
					:rows="4"
					hide-details
				/>
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
		<section class="mt-6 mb-4 d-flex align-center">
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
						GENERAL CONDITIONS OF USE OF SQUADDED
					</h4>
					<p>
						You will be able to access the services offered by SQUADDED, subject to having read and accepted these General Conditions of Use
						<br><br>
						By checking the box "I accept your General Conditions of Use", you acknowledge that you have read and accepted, without reserve, these General Conditions of Use and declare that you use the SQUADDED Services in accordance with the provisions of said conditions as well as the applicable laws and regulations.
						<br><br>
						The company SQUAD Experience LTD is a Company, registered in the Trade and Companies Register of Tel Aviv under number 516048246, having its registered office at 1, rue Rotschild, Tel Aviv - Israel, represented by Cyril Cohen as President (ci -after "SQUADDED").
						<br><br>
						SQUADDED has developed an interface accessible via the Internet offering users to interact and exchange with other users regarding their intention to purchase products offered by client companies, in particular, by creating a list of friends or “Squad”, by publishing content on the Solution interface or by posting “likes” or comments on the content of other users (hereinafter the “Solution” or the “SQUADDED Solution”); thus, this interface allows several users of the Solution to shop together on the internet.
					</p>
					<h4 class="my-4">
						1. DEFINITIONS
					</h4>
					<p>
						The terms and expressions below are understood to be either singular or plural.
						<br><br>
						"Squadded Community": all users of SQUADDED within an e-commerce site of the Merchant Site.
						<br><br>
						"User account (s)": designates the account created by the Users in order to benefit from the Services offered by SQUADDED.
						<br><br>
						"General Conditions of Use" or "CGU": these General Conditions of Use.
						<br><br>
						"Content (s)": designates the information created, sent or received by the User on the SQUADDED Solution including, and without this list being exhaustive, photos, messages, screenshots, "likes" », The comments, the votes, the names / first names of the Users, the name of the user, his bio, the products.
						<br><br>
						"Personal data" or "Data": means any information relating to an identified or identifiable natural person within the meaning of article 4§1 of regulation n ° 2016/679 of April 27, 2016 relating to the protection of natural persons at the with regard to the processing of personal data (hereinafter the "GDPR").
						<br><br>
						"Product sheet (s)" or "Product (s)": designates the file available online providing a brief description of a product offered for purchase by the Merchant Site among all of its product catalog and with the Add to wishlist Icon.
						<br><br>
						"Add to wishlist icon": designates the clickable icon, which can be represented by the SQUADDED logo, allowing the User to add a product to his Wishlist. This icon is located on the Product Sheet put online by the Merchant Site.
						<br><br>
						"Drawer icon": designates the clickable icon, which can be represented by the SQUADDED logo on the right of the User's screen when browsing the e-commerce site of the Merchant Site allowing the User to access to the SQUADDED Widget.
						<br><br>
						"Widget" or "Squadded Widget": designates the Web framework of the SQUADDED solution displaying the Content created, exchanged and disseminated by the Users as well as the Squadded notifications appearing on the site of the Merchant Site.
						<br><br>
						"Party" or "Parties": means SQUADDED and / or the User depending on the context.
						<br><br>
						"Services" or "SQUADDED Services": means, with regard to Users, the service of social interaction and linking of Users, offered by SQUADDED, concerning their intentions to purchase Products, and, at the with regard to client companies, the service to highlight and optimize the visibility of products offered for sale by client companies.
						<br><br>
						"Merchant site": designates the company offering online (via its e-merchant site) the sale of its Products, including the Add to wishlist icon and the Drawer icon, and having possibly signed a Customer Contract with SQUADDED.
						<br><br>
						"SQUADDED Solution" or "Solution": designates the SQUADDED IT solution made available to Users or Client Companies that have subscribed to SQUADDED Services.
						<br><br>
						"User": designates the Internet user, registered or in the process of registering for the SQUADDED Solution, having access to the Services offered by SQUADDED.
						<br><br>
						"Squad": designates the list of close friends defined by the User.
						<br><br>
						"Wishlist": designates a list of Products likely to interest the User appearing on his User Account.
					</p>
					<h4 class="my-4">
						2. PURPOSE
					</h4>
					<p>
						The purpose of these General Conditions of Use is to define the conditions and rules for using the SQUADDED Services provided to the User and to the Merchant Site.
						<br><br>
						<b>2.1 Creation of the User Account</b> <br>
						In order for the User to be able to register for the SQUADDED Solution and benefit from the Services via his computer or smartphone, he must follow the following steps:
						<br><br>
						<b>- Step 1:</b> when the User browses the website of a Merchant Site, he can click on the Add to wishlist Icon or the Drawer Icon directing him to the SQUADDED Widget;
						<br><br>
						<b>- Step 2:</b> the Widget gives explanations to the User regarding the SQUADDED Solution and allows the User to register for the Services (by clicking on the "sign in" button). If the User clicks on the “skip” or “sign up later” button, the latter will only be able to access the public version of the SQUADDED Solution and will not be able to benefit from all of the Services offered. ;
						<br><br>
						<b>- Step 3:</b> after clicking on the “sign in” button, the User is invited to register for the SQUADDED Solution by filling in the information requested. User registration can be carried out, according to their preferences, using several alternative methods, in particular: via their Facebook identifiers, by communicating their email address, via their google account or, as the case may be, through their account registered with the e-merchant site of the Merchant Site. In any event, before registering their registration, the User must read and accept these T & Cs via a check box.
						<br><br>
						In case of registration via Facebook, a request for confirmation of registration via the User's Facebook account will appear, if the User confirms it, he will be connected with his email and Facebook identifier. In case of registration via his google account, a request for confirmation of registration via the user's google account will appear, if the user confirms it, he will be connected with his email and google identifier. In case of registration via his email address, a single-use code will be sent to the User on his email corresponding to the email address provided. In case of registration via his account registered with the Merchant Site, a request for confirmation of registration will appear, if the User confirms it,
						<br><br>
						<b>- Step 4:</b> then the User must choose a user name and a profile photo. If the User has identified himself via Facebook or google, the preexisting user name and profile photo (from Facebook or google) can be used by SQUADDED by default in the User Account. However, the User can modify this information in the settings of his User Account.
						<br><br>
						When creating their User Account, the User undertakes to provide information corresponding to their own identity and must not provide false or erroneous information.
						<br><br>
						<b>2.2 Description of Services</b><br>
						The User is solely responsible for the use of the Services offered by SQUADDED, in particular, when sharing, publishing or disseminating Content.
						<br><br>
						The User undertakes to use the Services fairly, honestly and in good faith.
						<br><br>
						He also undertakes not to use robots, algorithms or any other intelligent machines or software to access the Services, this in order to ensure the security of the use of the SQUADDED Solution (for example, avoiding false profiles, identity theft, hacking etc.).
						<br><br>
						<b>2.2.1 Services provided to Users of the SQUADDED solution</b>
						<br><br>
						● Use of the Services and functionalities of the SQUADDED Solution
						<br><br>
						The SQUADDED Solution made available to registered Users includes several Services, in particular and without this list being exhaustive:
						<br><br>
						- create your “Squad” and add or remove members to your Squad;
						<br><br>
						- add or delete favorite members to his Squad;
						<br><br>
						- access a private news feed relating only to your Squad (on the “My Squad” Wall);
						<br><br>
						- access the public news feed of all Users (on the “Home” Wall) and be able to follow in priority their favorite Users on the public news feed;
						<br><br>
						- create a list of Favorite Products via its Wishlist;
						<br><br>
						- share Content on his private news feed (on “My Squad”) or on his public news feed (on “Home”) on which Users are invited to react (for example, by posting a “like” or a comment);
						<br><br>
						- the types of Content that can be shared are the following:
						<br><br>
						o Selection of Product (s) in his Wishlist: allowing the User to select the Product (s) that may interest him by clicking on the Add to wishlist Icon on the e-merchant site of the Merchant Site or on the Widget,
						<br><br>
						o Gallery: allowing the User to share his photo by linking it to the Products of the e-merchant site of the Merchant Site appearing on the photo,
						<br><br>
						o Survey: allowing the User to create a survey between two Products and receive the opinion of his Squad or the Squadded Community,
						<br><br>
						o Outfit / Look (or outfit): allowing the User to create a set of two to four products that he wishes to associate with each other (for example, a dress with shoes and a bag),
						<br><br>
						- receive notifications regarding their current activity (request to add to the Squad, vote for a poll, etc.);
						<br><br>
						- directly add Products from his Wishlist to his basket on the e-merchant site of the Merchant Site;
						<br><br>
						- share posts or profiles by email, instant messaging, Facebook and Instagram social networks ...;
						<br><br>
						● Configuration of User Accounts and Services
						<br><br>
						The SQUADDED Services also allow Users to indicate their preferences by configuring their User Account and the Services, in particular, and without this list being exhaustive:
						<br><br>
						- configure their profile, indicating or modifying in particular their first and last name, their bio, their user name;
						<br><br>
						- filter or restrict the public who can access the Content published, exchanged or shared on the SQUADDED Solution (in public or private mode);
						<br><br>
						- filter or restrict the public who can access the Contents of the User profile (in public or private mode).
						<br><br>
						SQUADDED may at any time update and update its Services (by deleting or adding Services or functionalities) and does not undertake in any case to guarantee the use of certain Services or functionalities of its Solution.
						<br><br>
						<b>2.2.2 Services provided to Client companies</b>
						<br><br>
						In the event that The SQUADDED Solution is made available to Client companies, for a fee, it allows them:
						<br><br>
						- install, implement and configure the SQUADDED Solution on the equipment and IT supports of the Merchant Site by supplying the necessary elements by SQUADDED;
						<br><br>
						- to benefit from the integration on their e-commerce site (s) of a social and community interface appearing on the Users' screen and allowing them to register and access SQUADDED Services via the Widget;
						<br><br>
						- optimize and improve the visibility of their Products by offering a new social experience to Users allowing them to share their Wishlist and add their own photo, outfit or survey to interact with other Users;
						<br><br>
						- to help the Users to choose and buy the Product (s) thanks to the recommendations, opinion of their “Squad” and other links between Products (a “paired item” button allows to facilitate the access to the recommendations and opinions thanks to the aggregation of content created by the SQUADDED Community).
					</p>
					<h4 class="my-4">
						3. DURATION - TERMINATION
					</h4>
					<p>
						<b>3.1 Duration of use of the Services</b>
						<br><br>
						The Services are provided to the User for an indefinite period, subject to the suspension and / or termination of the Services under the conditions provided for in 3.2, below. The User can stop using the Services at any time by deleting their User Account.
						<br><br>
						Regarding the Merchant Site, the conditions of duration and termination / suspension are defined in a separate document, in the event of the conclusion of a Customer Contract.
						<br><br>
						<b>3.2 Suspension - Termination</b><br><br>
						In the event of a breach by the User of the obligations provided for in these General Conditions of Use (and in particular, in Articles 2, 4, 5, 6, 7 and 10), SQUADDED reserves the right , without particular notice, or specific information, of:
						<br><br>
						● suspend the provision of the Services thus preventing access to the Services by the Users; and or
						<br><br>
						● terminate these General Conditions of Use and put an end to the provision of the Services, without prejudice to the right of SQUADDED to claim, if necessary, from the User compensation for the damage (s) suffered.
					</p>
					<h4 class="my-4">
						4. INTELLECTUAL PROPERTY
					</h4>
					<p>
						SQUADDED is the exclusive owner of all the rights relating to the Solution, in particular, the right to host, store, reproduce, modify, adapt, edit, publish, in whole or in part, components of the Solution.
						<br><br>
						The rights which SQUADDED holds may concern, without this list being exhaustive, the brands, logos, graphics, images, animations, texts, data, databases present and represented on the Solution. The rights available to SQUADDED may also relate to software and computer codes (for example, source codes or any other type of computer code) used on the Solution.
						<br><br>
						The User and the Merchant Site undertake not to infringe the intellectual property rights of SQUADDED or of any third party holding any intellectual property right in the Services and Contents of the SQUADDED Solution.
						<br><br>
						Any act of reproduction, representation, communication, distribution, marketing, reverse engineering, rental, sale or any other form of re-use, without the express written authorization of SQUADDED, may give rise to prosecution judicial in violation of his rights, protected, in particular, under his intellectual property rights (copyright, trademark law, patent law, design law, database law etc.) and / or Solution licenses.
						<br><br>
						Users can however use the SQUADDED Solution in a private and personal context and to the exclusion of any commercial purpose, subject to the concession by SQUADDED of a free, personal and non-transferable authorization.
					</p>
					<h4 class="my-4">
						5. LIMITATION OF LIABILITY
					</h4>
					<p>
						In the context of the use of its Solution, SQUADDED does its utmost to ensure that its use is secure and that the risks of fraudulent access are minimized.
						<br><br>
						However, the User or the merchant Site use the Solution at their own risk and under their exclusive responsibility.
						<br><br>
						SQUADDED therefore declines all responsibility:
						<br><br>
						● concerning the availability and accessibility of the Service, in the event of an interruption, malfunction, deterioration or disruption of the Service, attributable to the internet service provider, the internet network, the operating system, the browser, to a device used, to the operation of the e-merchant site of the Merchant Site or in the event of any other event relating to a case of force majeure;
						<br><br>
						● in the event of incompatibility of the Solution with any software, software package, operating system or any other device used by the User or the Merchant Site;
						<br><br>
						● in the event of interruption or disruption of the operation of the Solution for the purpose of maintenance or updating of the computer system;
						<br><br>
						● in the event of loss, accidental or not, of total or partial alteration or cleaning of the Content entered, exchanged, published or shared on the Solution;
						<br><br>
						● in the event of a purchase (s) made on the website (s) or store (s) of the Merchant Site or recommendations of Products from Merchant Sites (in particular through the Wishlist);
						<br><br>
						● in the event of Users organizing meetings, making contact or making an appointment, no longer through the SQUADDED Solution, but physically, in a “real” situation. Users using the SQUADDED Solution to organize such meetings are fully responsible for their actions and behaviors and SQUADDED cannot in any way be held liable for incidents or misdeeds committed on this occasion;
						<br><br>
						● in the event of dissemination, sharing, communication or transmission of elements on the SQUADDED Solution, protected by the rights of third parties, in particular, with regard to intellectual property (copyright, trademark law, database law , patent rights etc.) or personality rights (privacy, insult, defamation etc.).
					</p>
					<h4 class="my-4">
						6. USE AND MANAGEMENT OF CONTENT
					</h4>
					<p>
						In the context of the use of the Services of the Solution, the User may be required to create, send, share or receive Content.
						<br><br>
						Thus, the User grants SQUADDED several authorizations for the execution of said Services:
						<br><br>
						● a free authorization, for the whole world and for the duration of these General Conditions of Use, to host, store, reproduce, display, publish, translate and use the Content informed, published or shared within the framework of the SQUADDED solution;
						<br><br>
						● a free authorization, for the whole world and for the duration of these General Conditions of Use, to reuse the Content made public by the Users on the Solution (with other Users or third parties) for the purpose of promoting the SQUADDED solution, in particular, through the press or on social networks;
						<br><br>
						● a free authorization, for the whole world and for the duration of these General Conditions of Use, to use tools allowing debugging or correcting any malfunction and optimizing the User's experience on the Solution.
					</p>
					<h4 class="my-4">
						7. MODERATION OF CONTENT
					</h4>
					<p>
						<b>7.1 Conditions for moderation of Content</b><br><br>
						In the context of the use of the Services, SQUADDED does not generally monitor, monitor or filter all of the Content. SQUADDED therefore does not exercise an active role in moderating the Content and assumes the quality of hosting within the meaning of article 6.I.2. of law n ° 2004-575 of June 21, 2004 for Confidence in the digital economy called "LCEN".
						<br><br>
						However, SQUADDED reserves the right to delete, in whole or in part, and / or modify the Content as long as they do not comply with the moderation rules listed below.
						<br><br>
						In addition, SQUADDED also reserves the right to suspend and / or terminate the Services provided to Users who do not comply with the moderation rules, under the conditions referred to in article 3.2 of these Terms.
						<br><br>
						In accordance with article 6.I.7 of the LCEN, SQUADDED participates and contributes to the fight against a certain number of serious crimes (in particular, the dissemination of child pornography, the apology of war crimes or against humanity, the provocation and the apology of terrorism, the provocation to the suicide, the diffusion of violent, pornographic, discriminatory images or inciting to hatred). As such, SQUADDED has set up an easily accessible and visible device allowing any User to bring to its attention such Content according to the methods indicated below.
						<br><br>
						Any User having knowledge of Illegal Content and / or violating the moderation rules can report it or notify SQUADDED, according to the modalities provided for in article 6.I.5 of the LCEN, in the following way:
						<br><br>
						1 / click on the options of the publication to report (3 vertical points at the top right).
						<br><br>
						2 / click on "Report"
						<br><br>
						3 / choose the reason for the report
						<br><br>
						4 / click on the "Report" button
						<br><br>
						7.2 Moderation rules
						<br><br>
						SQUADDED requires Users of its Solution to comply with all of the moderation rules listed below.
						<br><br>
						In the context of the use of the Services and the Solution, it is strictly prohibited to:
						<br><br>
						▪ make remarks that are offensive, insulting, defamatory or incite violence against others;
						<br><br>
						▪ make racist, sexist, homophobic or any other type of discriminatory language;
						<br><br>
						▪ harass, intimidate or threaten other Users or any other person,
						<br><br>
						▪ publish, disseminate or share pornographic or child pornography images or videos, showing nudity or having sexual connotations, violent or bloody;
						<br><br>
						▪ publish texts, images or video aimed at promoting or advertising on behalf of a User, a company or any other natural or legal person;
						<br><br>
						▪ to communicate the personal data of any User or third party without their prior authorization (telephone number, surname, first name, email address, postal address etc.).
					</p>
					<h4 class="my-4">
						8. RELATIONSHIP BETWEEN SQUADDED AND THE MERCHANT SITE
					</h4>
					<p>
						The contractual relationship between SQUADDED and the Merchant Site is governed by a Customer Contract, to which are added, on an ancillary basis, these General Conditions of Use.
						<br><br>
						In case of contradiction or doubt on the interpretation of the T & Cs and the Customer Contract, the provisions of the Customer Contract will prevail and prevail over the T & Cs.
						<br><br>
						If the Solution is made available free of charge from the Merchant Site, no Customer Contract is concluded between the latter and SQUADDED. However, the merchant site is required to comply with the same provisions as those imposed on the User, in particular in articles 3, 4, 5 and 10 of these CGU.
					</p>
					<h4 class="my-4">
						9. PROTECTION OF PERSONAL DATA
					</h4>
					<p>
						<b>9.1 SQUADDED acts as data controller</b><br><br>
						As part of the execution of these T & Cs, SQUADDED undertakes to comply with the legal framework relating to the protection of Personal Data including regulation n ° 2016/679 of April 27, 2016 relating to the protection of individuals at with regard to the processing of personal data, known as "GDPR", and Law No. 78-17 of January 6, 1978 relating to data processing, files and freedoms, known as "Data Protection Act".
						<br><br>
						In the context of the use of the Services and the Solution, SQUADDED acts as data controller, in that it determines the "means and purposes" of the processing relating to User Data.
						<br><br>
						<b>9.2 Categories of Data processed by SQUADDED</b><br><br>
						● Data processed when Users register for the Solution:
						<br><br>
						SQUADDED may process Data relating to their identification:
						<br><br>
						● an email address (required);
						<br><br>
						● a user name (optional);
						<br><br>
						● a user name (required);
						<br><br>
						● a profile photo (optional);
						<br><br>
						● a confidential code (compulsory) for single use Once the registration is finalized, SQUADDED keeps a token (an identifier code) allowing the User to access his User Account without entering his identifiers, however, if the User disconnects from his User Account or beyond a period of inactivity of thirty (30) days, SQUADDED requests the User to re-enter his identification data;
						<br><br>
						● connection data (IP address) (required)  we do not keep it;
						<br><br>
						● in case of identification via Facebook, the Facebook identifier, the user name and the profile picture of the User (compulsory (because automatic))
						<br><br>
						● in the event of identification via the account initially created by the User with the Merchant Site, the name, first name, email address and the product (s) purchased by the Users.
						<br><br>
						● Data processed when using the Services:
						<br><br>
						The information processed in the context of the use of the Services is optional.
						<br><br>
						- Data relating to the Content created, disseminated and exchanged on the Solution
						<br><br>
						SQUADDED may process Data relating to the Content created, disseminated and exchanged by Users (post, description in the title of the post, comments, "likes", profile photos and shared photos, votes, etc.).
						<br><br>
						- Data relating to the User's navigation
						<br><br>
						SQUADDED also processes Navigation Data (pages visited, Products clicked, IP address, etc.).
						<br><br>
						<b>9.3 Purposes of the processing implemented by SQUADDED</b><br><br>
						SQUADDED performs Data processing for the following purposes:
						<br><br>
						<b>9.3.1 Access and management of the SQUADDED Solution Services</b>
						<br><br>
						This purpose pursues the following sub-purposes:
						<br><br>
						- creation of the User Account allowing Users to subscribe to the SQUADDED Services (username, email address, telephone number, confidential code etc.);
						<br><br>
						- management, operation and improvement of SQUADDED Services (post, comments, "likes", organic, etc.);
						<br><br>
						- analysis and measurement of the audience and frequentation of the Solution;
						<br><br>
						- real-time information of Users on their current interactions and activities on the Solution via the sending of "push" notifications (addition of a new member in the Squad, vote of a User on a poll etc.);
						<br><br>
						- share with our client companies information relating to your activity on the Solution in order to optimize and refine the products offered. (Wishlist, e-mail address, "likes", click on a Product Sheet etc.)
						<br><br>
						<b>9.3.2 Security and reporting management on the SQUADDED Solution</b>
						<br><br>
						This purpose pursues the following sub-purposes:
						<br><br>
						- prevent and detect fraudulent activities (false identity, identity theft, etc.), unlawful activities (acts of sexual display, images promoting pedophilia or terrorism) or threatening the security of the use of the SQUADDED Solution;
						<br><br>
						- reception and management of reports made by Users concerning illegal behavior or violating these General Conditions of Use;
						<br><br>
						- responses to requests from judicial or administrative authorities, legally empowered supervisory authorities or judicial officers;
						<br><br>
						- prevent, manage and correct malfunctions, bugs or technical interruptions affecting the Solution;
						<br><br>
						- apply and enforce these General Conditions of Use.
						<br><br>
						<b>9.4 Legal bases used by SQUADDED</b><br><br>
						SQUADDED processes User Data, in particular, on the basis of the following legal bases:
						<br><br>
						- the execution of the contract (in this case, the execution of the General Conditions of Use);
						<br><br>
						- User consent (for example, sending a "push" notification informing the User about his current activity);
						<br><br>
						- the legitimate interest pursued by SQUADDED (for example, detection of fraudulent, unlawful behavior, etc.);
						<br><br>
						- fulfillment of a legal obligation (for example, the obligation to make available to the authorities the identification data of persons who contributed to the creation of content).
						<br><br>
						<b>9.5 Data retention periods</b><br><br>
						As soon as this is strictly necessary with regard to the intended purposes, SQUADDED retains your Data, in particular, for the following retention periods:
						<br><br>
						- the duration of execution of the T & Cs;
						<br><br>
						- the legal durations provided for by law (for example, in terms of data contributing to the creation of content, this duration is 1 year);
						<br><br>
						- the duration necessary for the establishment, defense and exercise of a legal right with regard to the duration of applicable statutory limitation.
						<br><br>
						<b>9.6 Recipients and transfers of Data</b><br><br>
						The Personal Data collected by SQUADDED is exclusively intended for its authorized personnel (i.e., a dedicated technical team).
						<br><br>
						However, SQUADDED may share this Data with its client companies with your consent.
						<br><br>
						Data is not transferred outside the European Union.
						<br><br>
						<b>9.7 Exercise of the rights of data subjects</b><br><br>
						The User has a certain number of rights concerning his Personal Data, in particular, a right of access, opposition, rectification, to lodge a complaint before the competent supervisory authority (i.e., in France, the CNIL), to erasure, limitation, portability and to define post-mortem directives relating to the fate of its data.
						<br><br>
						The User can exercise all of their rights by contacting SQUADDED at the following address privacy@squadded.co
					</p>
					<h4 class="my-4">
						10. APPLICABLE LAW AND COMPETENT JURISDICTION
					</h4>
					<p>
						These Conditions are governed by French law.
						<br><br>
						For any dispute of any kind, likely to arise on the occasion of the interpretation, the execution of these CGU, the attribution of jurisdiction is made to the courts of the jurisdiction of the Court of Appeal of Paris.
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
		showTermsRead() {
			window.parent.postMessage(JSON.stringify({
				type: 'open-link',
				link: 'https://www.squadded.co/privacy-policy',
			}), '*');
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
	color #B8B8BA
	font-weight 500
	font-size 3.38vw

.action-button
	color black
	font-size 3.23vw
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
.title-text
	font-size 3.23vw
</style>
