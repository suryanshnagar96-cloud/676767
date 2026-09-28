import {db} from '@/lib/db';import {encrypt,decrypt} from '@/lib/crypto';import type {User,TwitterToken,ScheduledPost,ScheduledPostStatus,AutoDmCampaign,DmLog} from '@/lib/types';
const token=(r:any):TwitterToken=>({...r,accessToken:decrypt(r.accessToken),refreshToken:decrypt(r.refreshToken)});
const post=(r:any):ScheduledPost=>({...r,content:JSON.parse(r.content)});
const camp=(r:any):AutoDmCampaign=>r;
const log=(r:any):DmLog=>r;
export async function findOrCreateUserByEmail(email:string):Promise<User>{const r=await db.user.upsert({where:{email},update:{},create:{email}});return r}
export async function getUserById(id:string){return db.user.findUnique({where:{id}})}
export async function getDefaultUser(){return findOrCreateUserByEmail(process.env.DEFAULT_USER_EMAIL??'demo@xreech.local')}
export async function saveTwitterToken(i:any){const e=await db.twitterToken.findFirst({where:{userId:i.userId,twitterUserId:i.twitterUserId}});const data={accessToken:encrypt(i.accessToken),refreshToken:encrypt(i.refreshToken),expiresAt:i.expiresAt,scope:i.scope??null,isPremium:i.isPremium??false};const r=e?await db.twitterToken.update({where:{id:e.id},data}):await db.twitterToken.create({data:{...data,userId:i.userId,twitterUserId:i.twitterUserId}});return token(r)}
export async function setTwitterPremiumStatus(userId:string,isPremium:boolean){await db.twitterToken.updateMany({where:{userId},data:{isPremium}});const r=await db.twitterToken.findFirst({where:{userId},orderBy:{updatedAt:'desc'}});return r?token(r):null}
export async function getTwitterTokenByUserId(userId:string){const r=await db.twitterToken.findFirst({where:{userId},orderBy:{updatedAt:'desc'}});return r?token(r):null}
export async function deleteTwitterTokenByUserId(userId:string){await db.twitterToken.deleteMany({where:{userId}})}
export async function createScheduledPost(i:any){return post(await db.scheduledPost.create({data:{userId:i.userId,content:JSON.stringify(i.content),scheduledAt:i.scheduledAt,status:i.status??'PENDING',xTweetId:i.xTweetId??null,errorMessage:i.errorMessage??null}}))}
export async function getScheduledPost(id:string){const r=await db.scheduledPost.findUnique({where:{id}});return r?post(r):null}
export async function listScheduledPostsByUser(userId:string){return (await db.scheduledPost.findMany({where:{userId},orderBy:{createdAt:'desc'}})).map(post)}
export async function updateScheduledPost(id:string,p:any){const r=await db.scheduledPost.update({where:{id},data:{...(p.status!==undefined&&{status:p.status}),...(p.xTweetId!==undefined&&{xTweetId:p.xTweetId}),...(p.errorMessage!==undefined&&{errorMessage:p.errorMessage}),...(p.content!==undefined&&{content:JSON.stringify(p.content)}),...(p.scheduledAt!==undefined&&{scheduledAt:p.scheduledAt})}});return post(r)}
export async function deleteScheduledPost(id:string){await db.scheduledPost.delete({where:{id}})}
export async function createAutoDmCampaign(i:any){return camp(await db.autoDmCampaign.create({data:{userId:i.userId,parentTweetId:i.parentTweetId,triggerKeyword:i.triggerKeyword,dmMessage:i.dmMessage,isActive:i.isActive??true,scheduledPostId:i.scheduledPostId??null}}))}
export async function getAutoDmCampaign(id:string){return db.autoDmCampaign.findUnique({where:{id}})}
export async function listAutoDmCampaignsByUser(userId:string){return db.autoDmCampaign.findMany({where:{userId},orderBy:{createdAt:'desc'}})}
export async function listActiveAutoDmCampaigns(){return db.autoDmCampaign.findMany({where:{isActive:true},orderBy:{createdAt:'desc'}})}
export async function updateAutoDmCampaign(id:string,p:any){return db.autoDmCampaign.update({where:{id},data:{...(p.isActive!==undefined&&{isActive:p.isActive}),...(p.triggerKeyword!==undefined&&{triggerKeyword:p.triggerKeyword}),...(p.dmMessage!==undefined&&{dmMessage:p.dmMessage}),...(p.lastPolledAt!==undefined&&{lastPolledAt:p.lastPolledAt})}})}
export async function recordDmLog(i:any){return log(await db.dmLog.upsert({where:{campaignId_recipientTwitterId:{campaignId:i.campaignId,recipientTwitterId:i.recipientTwitterId}},update:{replyText:i.replyText??null,replyTweetId:i.replyTweetId??null,sentAt:new Date()},create:{campaignId:i.campaignId,recipientTwitterId:i.recipientTwitterId,replyText:i.replyText??null,replyTweetId:i.replyTweetId??null}}))}
export async function hasDmBeenSent(campaignId:string,recipientTwitterId:string){return !!(await db.dmLog.findUnique({where:{campaignId_recipientTwitterId:{campaignId,recipientTwitterId}},select:{id:true}}))}
export async function countDmsForCampaign(campaignId:string){return db.dmLog.count({where:{campaignId}})}
export async function countTotalDms(){return db.dmLog.count()}
export async function countPostsByUser(userId:string){return db.scheduledPost.count({where:{userId}})}
export async function countPostsByUserAndStatus(userId:string,status:string){return db.scheduledPost.count({where:{userId,status}})}
export async function countActiveCampaignsByUser(userId:string){return db.autoDmCampaign.count({where:{userId,isActive:true}})}
