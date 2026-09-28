export type StorageMode='supabase';
export function detectStorageMode():StorageMode{return 'supabase'}
async function getAdapter(){return import('@/lib/adapters/supabase-real')}
export async function findOrCreateUserByEmail(email:string){return (await getAdapter()).findOrCreateUserByEmail(email)}
export async function getUserById(id:string){return (await getAdapter()).getUserById(id)}
export async function getDefaultUser(){return (await getAdapter()).getDefaultUser()}
export async function saveTwitterToken(input:any){return (await getAdapter()).saveTwitterToken(input)}
export async function setTwitterPremiumStatus(userId:string,isPremium:boolean){return (await getAdapter()).setTwitterPremiumStatus(userId,isPremium)}
export async function getTwitterTokenByUserId(userId:string){return (await getAdapter()).getTwitterTokenByUserId(userId)}
export async function deleteTwitterTokenByUserId(userId:string){return (await getAdapter()).deleteTwitterTokenByUserId(userId)}
export async function createScheduledPost(input:any){return (await getAdapter()).createScheduledPost(input)}
export async function getScheduledPost(id:string){return (await getAdapter()).getScheduledPost(id)}
export async function listScheduledPostsByUser(userId:string){return (await getAdapter()).listScheduledPostsByUser(userId)}
export async function updateScheduledPost(id:string,patch:any){return (await getAdapter()).updateScheduledPost(id,patch)}
export async function deleteScheduledPost(id:string){return (await getAdapter()).deleteScheduledPost(id)}
export async function createAutoDmCampaign(input:any){return (await getAdapter()).createAutoDmCampaign(input)}
export async function getAutoDmCampaign(id:string){return (await getAdapter()).getAutoDmCampaign(id)}
export async function listAutoDmCampaignsByUser(userId:string){return (await getAdapter()).listAutoDmCampaignsByUser(userId)}
export async function listActiveAutoDmCampaigns(){return (await getAdapter()).listActiveAutoDmCampaigns()}
export async function updateAutoDmCampaign(id:string,patch:any){return (await getAdapter()).updateAutoDmCampaign(id,patch)}
export async function recordDmLog(input:any){return (await getAdapter()).recordDmLog(input)}
export async function hasDmBeenSent(campaignId:string,recipientTwitterId:string){return (await getAdapter()).hasDmBeenSent(campaignId,recipientTwitterId)}
export async function countDmsForCampaign(campaignId:string){return (await getAdapter()).countDmsForCampaign(campaignId)}
export async function countTotalDms(){return (await getAdapter()).countTotalDms()}
export async function countPostsByUser(userId:string){return (await getAdapter()).countPostsByUser(userId)}
export async function countPostsByUserAndStatus(userId:string,status:string){return (await getAdapter()).countPostsByUserAndStatus(userId,status)}
export async function countActiveCampaignsByUser(userId:string){return (await getAdapter()).countActiveCampaignsByUser(userId)}
