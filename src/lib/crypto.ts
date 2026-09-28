import crypto from 'crypto';
const ALGO='aes-256-gcm', IV_LEN=12;
function getKey():Buffer{
 const raw=process.env.ENCRYPTION_KEY;
 if(raw){if(/^[0-9a-fA-F]{64}$/.test(raw))return Buffer.from(raw,'hex');const b=Buffer.from(raw,'base64');if(b.length===32)return b;return crypto.createHash('sha256').update(raw).digest();}
 return crypto.createHash('sha256').update('xreech-dev-key').digest();
}
export function encrypt(plaintext:string){const iv=crypto.randomBytes(IV_LEN);const cipher=crypto.createCipheriv(ALGO,getKey(),iv);const enc=Buffer.concat([cipher.update(plaintext,'utf8'),cipher.final()]);return [iv.toString('base64'),cipher.getAuthTag().toString('base64'),enc.toString('base64')].join(':')}
export function decrypt(payload:string){const [ivB64,tagB64,encB64]=payload.split(':');if(!ivB64||!tagB64||!encB64)throw new Error('Invalid ciphertext payload');const decipher=crypto.createDecipheriv(ALGO,getKey(),Buffer.from(ivB64,'base64'));decipher.setAuthTag(Buffer.from(tagB64,'base64'));return Buffer.concat([decipher.update(Buffer.from(encB64,'base64')),decipher.final()]).toString('utf8')}
