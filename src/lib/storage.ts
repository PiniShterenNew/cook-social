// src/lib/storage.ts
import { B2 } from '@backblaze-b2/b2-sdk';
import { v4 as uuidv4 } from 'uuid';

const b2 = new B2({
  applicationKeyId: process.env.BACKBLAZE_KEY_ID || '',
  applicationKey: process.env.BACKBLAZE_APP_KEY || '',
});

// האם כבר התחברנו?
let authorized = false;

// פונקציה לקבלת authorization
async function authorize() {
  if (!authorized) {
    await b2.authorize();
    authorized = true;
  }
}

// העלאת קובץ
export async function uploadFile(buffer: Buffer, fileName: string, contentType: string): Promise<string> {
  await authorize();
  
  // קבלת URL להעלאה
  const bucketId = process.env.BACKBLAZE_BUCKET_ID || '';
  const { uploadUrl, authorizationToken } = await b2.getUploadUrl({
    bucketId,
  });
  
  // יצירת שם ייחודי
  const uniqueFileName = `${uuidv4()}-${fileName}`;
  
  // העלאה
  const response = await b2.uploadFile({
    uploadUrl,
    uploadAuthToken: authorizationToken,
    fileName: uniqueFileName,
    data: buffer,
    contentType,
  });
  
  // קבלת URL הציבורי של הקובץ
  const downloadUrl = `${process.env.BACKBLAZE_DOWNLOAD_URL}/${uniqueFileName}`;
  
  return downloadUrl;
}

// מחיקת קובץ
export async function deleteFile(fileName: string): Promise<void> {
  await authorize();
  
  // קבלת פרטי הקובץ
  const bucketId = process.env.BACKBLAZE_BUCKET_ID || '';
  
  // מציאת גרסת הקובץ
  const response = await b2.listFileNames({
    bucketId,
    startFileName: fileName,
    maxFileCount: 1,
  });
  
  if (response.files.length > 0) {
    const fileInfo = response.files[0];
    
    // מחיקת הקובץ
    await b2.deleteFileVersion({
      fileId: fileInfo.fileId,
      fileName: fileInfo.fileName,
    });
  }
}