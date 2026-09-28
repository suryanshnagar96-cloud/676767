// Shared Xreech types
export interface User { id:string; email:string; createdAt:Date }
export interface TwitterToken { id:string; userId:string; twitterUserId:string; accessToken:string; refreshToken:string; expiresAt:Date; scope?:string|null; isPremium:boolean; createdAt:Date; updatedAt:Date }
export const FREE_TWEET_MAX_CHARS=280;
export const PREMIUM_TWEET_MAX_CHARS=25000;
export const FREE_TWEET_WARN_CHARS=260;
export const PREMIUM_TWEET_WARN_CHARS=24500;
export function tweetMaxChars(isPremium:boolean|null|undefined){return isPremium?PREMIUM_TWEET_MAX_CHARS:FREE_TWEET_MAX_CHARS}
export function tweetWarnChars(isPremium:boolean|null|undefined){return isPremium?PREMIUM_TWEET_WARN_CHARS:FREE_TWEET_WARN_CHARS}
export type ScheduledPostStatus='DRAFT'|'PENDING'|'PROCESSING'|'PUBLISHED'|'FAILED';
export interface ScheduledPost {id:string;userId:string;content:string[];scheduledAt:Date;status:ScheduledPostStatus;xTweetId:string|null;errorMessage:string|null;createdAt:Date;updatedAt:Date}
export interface AutoDmCampaign {id:string;userId:string;parentTweetId:string;triggerKeyword:string;dmMessage:string;isActive:boolean;lastPolledAt:Date|null;createdAt:Date;updatedAt:Date}
export interface DmLog {id:string;campaignId:string;recipientTwitterId:string;sentAt:Date;replyText?:string|null;replyTweetId?:string|null}
export interface CreatePostPayload {content:string[];scheduledAt?:string;postNow?:boolean;draft?:boolean;attachAutoDm?:{triggerKeyword:string;dmMessage:string}}
export interface CreateCampaignPayload {parentTweetId:string;triggerKeyword:string;dmMessage:string;isActive?:boolean}
export interface MetricsResponse {twitterConnected:boolean;twitterHandle?:string;twitterUserId?:string|null;isPremium:boolean;totalPostsScheduled:number;totalPostsPublished:number;totalPostsFailed:number;totalDmsSent:number;activeCampaigns:number}
export interface TwitterTweetResponse {id:string;text:string}
export interface TwitterReplyMeta {authorId:string;text:string;tweetId:string}
export interface TweetSchedulerJobPayload {postId:string}
export interface AutoDmPollerJobPayload {campaignId?:string}
