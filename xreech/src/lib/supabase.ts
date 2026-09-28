import type {AutoDmCampaign,DmLog,ScheduledPost,ScheduledPostStatus,TwitterToken,User} from '@/lib/types';
export type StorageMode='supabase'|'prisma';
export function detectStorageMode():StorageMode{return process.env.NEXT_PUBLIC_SUPABASE_URL||process.env.SUPABASE_URL?'supabase':'prisma'}
async function getAdapter(){return detectStorageMode()==='supabase'?import('@/lib/adapters/supabase-real'):import('@/lib/adapters/supabase-prisma')}
export async function findOrCreateUserByEmail(email:string):Promise<User>{return (await getAdapter()).findOrCreateUserByEmail(email)}
export async function getUserById(id:string){return (await getAdapter()).getUserById(id)}
export async function getDefaultUser(){return (await getAdapter()).getDefaultUser()}
export async function saveTwitterToken(input:{userId:string;twitterUserId:string;accessToken:string;refreshToken:string;expiresAt:Date;scope?:string;isPremium?:boolean}):Promise<TwitterToken>{return (await getAdapter()).saveTwitterToken(input)}
export async function setTwitterPremiumStatus(userId:string,isPremium:boolean){return (await getAdapter()).setTwitterPremiumStatus(userId,isPremium)}
export async function getTwitterTokenByUserId(userId:string){return (await getAdapter()).getTwitterTokenByUserId(userId)}
export async function deleteTwitterTokenByUserId(userId:string){return (await getAdapter()).deleteTwitterTokenByUserId(userId)}
export async function createScheduledPost(input:{userId:string;content:string[];scheduledAt:Date;status?:ScheduledPostStatus;xTweetId?:string|null;errorMessage?:string|null}){return (await getAdapter()).createScheduledPost(input)}
export async function getScheduledPost(id:string){return (await getAdapter()).getScheduledPost(id)}
export async function listScheduledPostsByUser(userId:string){return (await getAdapter()).listScheduledPostsByUser(userId)}
export async function updateScheduledPost(id:string,patch:Partial<{status:ScheduledPostStatus;xTweetId:string|null;errorMessage:string|null;content:string[];scheduledAt:Date}>){return (await getAdapter()).updateScheduledPost(id,patch)}
export async function deleteScheduledPost(id:string){return (await getAdapter()).deleteScheduledPost(id)}
export async function createAutoDmCampaign(input:{userId:string;parentTweetId:string;triggerKeyword:string;dmMessage:string;isActive?:boolean;scheduledPostId?:string|null}){return (await getAdapter()).createAutoDmCampaign(input)}
export async function getAutoDmCampaign(id:string){return (await getAdapter()).getAutoDmCampaign(id)}
export async function listAutoDmCampaignsByUser(userId:string){return (await getAdapter()).listAutoDmCampaignsByUser(userId)}
export async function listActiveAutoDmCampaigns(){return (await getAdapter()).listActiveAutoDmCampaigns()}
export async function updateAutoDmCampaign(id:string,patch:Partial<Pick<AutoDmCampaign,'isActive'|'triggerKeyword'|'dmMessage'|'lastPolledAt'>>){return (await getAdapter()).updateAutoDmCampaign(id,patch)}
export async function recordDmLog(input:{campaignId:string;recipientTwitterId:string;replyText?:string|null;replyTweetId?:string|null}){return (await getAdapter()).recordDmLog(input)}
export async function hasDmBeenSent(campaignId:string,recipientTwitterId:string){return (await getAdapter()).hasDmBeenSent(campaignId,recipientTwitterId)}
export async function countDmsForCampaign(campaignId:string){return (await getAdapter()).countDmsForCampaign(campaignId)}
export async function countTotalDms(){return (await getAdapter()).countTotalDms()}
export async function countPostsByUser(userId:string){return (await getAdapter()).countPostsByUser(userId)}
export async function countPostsByUserAndStatus(userId:string,status:string){return (await getAdapter()).countPostsByUserAndStatus(userId,status)}
export async function countActiveCampaignsByUser(userId:string){return (await getAdapter()).countActiveCampaignsByUser(userId)}
