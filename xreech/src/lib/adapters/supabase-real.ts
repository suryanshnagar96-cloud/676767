import {createClient} from '@supabase/supabase-js';
import {encrypt,decrypt} from '@/lib/crypto';
const db=createClient(process.env.SUPABASE_URL??process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY!);
const u=(r:any)=>({id:r.id,email:r.email,createdAt:new Date(r.created_at)});
const t=(r:any)=>({...r,id:r.id,userId:r.user_id,twitterUserId:r.twitter_user_id,accessToken:decrypt(r.access_token),refreshToken:decrypt(r.refresh_token),expiresAt:new Date(r.expires_at),scope:r.scope,isPremium:r.is_premium,createdAt:new Date(r.created_at),updatedAt:new Date(r.updated_at)});
const p=(r:any)=>({...r,id:r.id,userId:r.user_id,content:r.content,scheduledAt:new Date(r.scheduled_at),status:r.status,xTweetId:r.x_tweet_id,errorMessage:r.error_message,createdAt:new Date(r.created_at),updatedAt:new Date(r.updated_at)});
async function one(q:any){const r=await q;if(r.error)throw r.error;return r.data}
export async function findOrCreateUserByEmail(email:string){return u(await one(db.from('users').upsert({email},{onConflict:'email'}).select('*').single()))}
export async function getUserById(id:string){const r=await one(db.from('users').select('*').eq('id',id).maybeSingle());return r?u(r):null}
export async function getDefaultUser(){return findOrCreateUserByEmail(process.env.DEFAULT_USER_EMAIL??'demo@xreech.local')}
export async function saveTwitterToken(i:any){return t(await one(db.from('twitter_tokens').upsert({user_id:i.userId,twitter_user_id:i.twitterUserId,access_token:encrypt(i.accessToken),refresh_token:encrypt(i.refreshToken),expires_at:i.expiresAt.toISOString(),scope:i.scope??null,is_premium:i.isPremium??false},{onConflict:'user_id,twitter_user_id'}).select('*').single()))}
export async function setTwitterPremiumStatus(userId:string,isPremium:boolean){const r=await one(db.from('twitter_tokens').update({is_premium:isPremium}).eq('user_id',userId).select('*').order('updated_at',{ascending:false}).limit(1).maybeSingle());return r?t(r):null}
export async function getTwitterTokenByUserId(userId:string){const r=await one(db.from('twitter_tokens').select('*').eq('user_id',userId).order('updated_at',{ascending:false}).limit(1).maybeSingle());return r?t(r):null}
export async function deleteTwitterTokenByUserId(userId:string){await one(db.from('twitter_tokens').delete().eq('user_id',userId))}
export async function createScheduledPost(i:any){return p(await one(db.from('scheduled_posts').insert({user_id:i.userId,content:i.content,scheduled_at:i.scheduledAt.toISOString(),status:i.status??'PENDING'}).select('*').single()))}
export async function getScheduledPost(id:string){const r=await one(db.from('scheduled_posts').select('*').eq('id',id).maybeSingle());return r?p(r):null}
export async function listScheduledPostsByUser(userId:string){return (await one(db.from('scheduled_posts').select('*').eq('user_id',userId).order('created_at',{ascending:false}))).map(p)}
export async function updateScheduledPost(id:string,x:any){const d:any={updated_at:new Date().toISOString()};if(x.status!==undefined)d.status=x.status;if(x.xTweetId!==undefined)d.x_tweet_id=x.xTweetId;if(x.errorMessage!==undefined)d.error_message=x.errorMessage;if(x.content!==undefined)d.content=x.content;if(x.scheduledAt!==undefined)d.scheduled_at=x.scheduledAt.toISOString();return p(await one(db.from('scheduled_posts').update(d).eq('id',id).select('*').single()))}
export async function deleteScheduledPost(id:string){await one(db.from('scheduled_posts').delete().eq('id',id))}
export async function createAutoDmCampaign(i:any){return one(db.from('auto_dm_campaigns').insert({user_id:i.userId,parent_tweet_id:i.parentTweetId,trigger_keyword:i.triggerKeyword,dm_message:i.dmMessage,is_active:i.isActive??true,scheduled_post_id:i.scheduledPostId??null}).select('*').single())}
export async function getAutoDmCampaign(id:string){return one(db.from('auto_dm_campaigns').select('*').eq('id',id).maybeSingle())}
export async function listAutoDmCampaignsByUser(userId:string){return one(db.from('auto_dm_campaigns').select('*').eq('user_id',userId).order('created_at',{ascending:false}))}
export async function listActiveAutoDmCampaigns(){return one(db.from('auto_dm_campaigns').select('*').eq('is_active',true))}
export async function updateAutoDmCampaign(id:string,x:any){const d:any={updated_at:new Date().toISOString()};if(x.isActive!==undefined)d.is_active=x.isActive;if(x.triggerKeyword!==undefined)d.trigger_keyword=x.triggerKeyword;if(x.dmMessage!==undefined)d.dm_message=x.dmMessage;if(x.lastPolledAt!==undefined)d.last_polled_at=x.lastPolledAt.toISOString();return one(db.from('auto_dm_campaigns').update(d).eq('id',id).select('*').single())}
export async function recordDmLog(i:any){return one(db.from('dm_logs').upsert({campaign_id:i.campaignId,recipient_twitter_id:i.recipientTwitterId,reply_text:i.replyText??null,reply_tweet_id:i.replyTweetId??null},{onConflict:'campaign_id,recipient_twitter_id'}).select('*').single())}
export async function hasDmBeenSent(c:string,r:string){return !!await one(db.from('dm_logs').select('id').eq('campaign_id',c).eq('recipient_twitter_id',r).maybeSingle())}
export async function countDmsForCampaign(c:string){const r=await one(db.from('dm_logs').select('id',{count:'exact',head:true}).eq('campaign_id',c));return r?.count??0}
export async function countTotalDms(){const r=await one(db.from('dm_logs').select('id',{count:'exact',head:true}));return r?.count??0}
export async function countPostsByUser(u:string){const r=await one(db.from('scheduled_posts').select('id',{count:'exact',head:true}).eq('user_id',u));return r?.count??0}
export async function countPostsByUserAndStatus(u:string,s:string){const r=await one(db.from('scheduled_posts').select('id',{count:'exact',head:true}).eq('user_id',u).eq('status',s));return r?.count??0}
export async function countActiveCampaignsByUser(u:string){const r=await one(db.from('auto_dm_campaigns').select('id',{count:'exact',head:true}).eq('user_id',u).eq('is_active',true));return r?.count??0}
