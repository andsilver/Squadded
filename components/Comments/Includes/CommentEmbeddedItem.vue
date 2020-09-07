<template>
	<section class="embedded-comment-box" :class="forFeed ? 'for-feed-comment' : 'for-reaction-comment'">
		<div class="header-comment-box">
			<div class="subheader-comment-box">
				<UserLink
					v-if="!forFeed"
					ref="comment-author-user-link"
					size="7.69vw"
					:user="comment.author"
					hide-name
					follow
					class="avatar-user-link"
				/>
				<span>
					<UserLink
						ref="comment-author-name-user-link"
						class="comment_user_name"
						:user="comment.author"
						hide-avatar
					/>
					<CommentShow
						ref="comment-text"
						class="comment_text"
						:comment="comment.text"
						:post="post"
					/>
				</span>
			</div>
			<PopMenu v-if="!forFeed" :comment="comment" :post="post" />
		</div>
		<div>
			<div class="comment-embedded-box">
				<v-img
					v-for="(item, i) in embeddedItems"
					:key="i"
					:src="item.img"
					class="comment-embedded-img"
					:class="embeddedImageClasse"
					cover
					@click="goToReaction(item)"
				>
					<div v-if="shouldLimitPreview && i === 2" class="comment-embedded-preview" justify="center" align="center">
						<div class="comment-embedded-preview-length">
							+{{ embeddedItemsLength - 2 }}
						</div>
					</div>
					<!-- TODO: WAINTING FOR BACKEND CHANGES -->
					<!-- <ReSquaddButton v-if="!forFeed" :item="item" class="comment-embedded-preview-reSquaddButton" /> -->
				</v-img>
			</div>
			<span
				v-if="!forFeed"
				class="message-time"
			>
				{{ timeString }}
			</span>
		</div>
	</section>
</template>

<script>

import PopMenu from './PopMenu';
import CommentShow from './CommentShow';
import UserLink from '~/components/UserLink';
// import ReSquaddButton from '~/components/ReSquaddButton';
import { addGAquery } from '~/utils/track-source-link';
import { OPENED_POST } from '~/consts/keys';
import { SquadAPI } from '~/services/SquadAPI';
import { sendGAction } from '~/utils/ga-action';
import { GA_ACTIONS } from '~/consts';

export default {
	components: {
		UserLink,
		PopMenu,
		CommentShow,
		// ReSquaddButton,
	},
	props: {
		comment: {
			type: Object,
			required: true,
		},
		post: {
			type: Object,
			required: true,
		},
		forFeed: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		timeString () {
			const timestring = {
				future: 'in %s',
				past: '%s ago',
				s: '1s',
				ss: '%ds',
				m: '1m',
				mm: '%dm',
				h: '1h',
				hh: '%dh',
				d: '1d',
				dd: '%dd',
				M: '4w',
				MM: '%dm',
				y: '1y',
				yy: '%dy',
			};
			window.moment.locale(this._i18n.locale, { relativeTime: timestring });
			return this.comment.ts && window.moment(this.comment.ts).fromNow(true);
		},
		embeddedItemsLength() {
			return this.comment.items.length;
		},
		shouldLimitPreview() {
			return this.forFeed && this.embeddedItemsLength > 3;
		},
		embeddedItems() {
			return this.shouldLimitPreview ? this.comment.items.slice(0, 3) : this.comment.items;
		},
		embeddedImageClasse() {
			return {
				'comment-embedded-img-feed': this.forFeed,
				'comment-embedded-img-reaction': !this.forFeed,
				'limit-preview': this.shouldLimitPreview,
			};
		},
	},
	methods: {
		goToReaction(item) {
			if (this.forFeed) {
				this.$router.push(`/post/${this.post.postId}/reactions`);
			} else {
				sessionStorage.setItem(OPENED_POST, this.post.postId);
				// add source on click
				const currentItem = Object.assign(item, {
					url: addGAquery(item.url),
				});
				SquadAPI.openProduct(currentItem);
				sendGAction(GA_ACTIONS.CLICK_ITEM);
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.for-reaction-comment {
    margin-bottom: 6.153vw;
}

.for-feed-comment {
	margin-bottom: 1vw;
}

.embedded-comment-box {
    padding: 0 1.53vw;

    .header-comment-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 3.23vw;
        line-height: 4VW;

        .subheader-comment-box {
            display: flex;
            align-items: center;

            .avatar-user-link {
                align-self: flex-start
            }

            .comment_text {
                color: #000000;
                font-weight: 400;
                font-size: 3.23vw;
                line-height: 3.69vw;
            }

            .comment_user_name {
                font-weight: 500;
                color: black;
                margin-right: 3px;
            }
        }

    }

.comment-embedded-box {
  display: flex;
  overflow-x: auto;
  margin-top: 1vw;
  padding-bottom: 10px;

	&::-webkit-scrollbar {
		height: 3px;
	}

	&::-webkit-scrollbar-track {
		background-color: rgba(0, 0, 0, 0.1);
	}

	&::-webkit-scrollbar-thumb {
		background-color: #717171;
		border-radius: 5px;
	}

    .comment-embedded-img {
        border-radius: 5px;
        flex: 0 0 35% !important;
        margin-right: 2%;
		cursor: pointer;
}

.comment-embedded-img-feed {
  flex: 0 0 44px !important;
  height: 56px;
}
.comment-embedded-img-reaction {
  flex: 0 0 108px !important;
  height: 140px;
}
.comment-embedded-preview {
  display: flex;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  justify-content: center;
  align-items: center;
}
.comment-embedded-preview-length {
  color: #fff;
  font-size: 6vw;
  font-weight: 600;
}
.comment-embedded-preview-reSquaddButton {
  top: 1vw !important;
  right: 1vw !important;
  width: 24px !important;
   height: 24px !important;
   font-size: 13px;
   line-height: unset;
}
}

}

</style>
