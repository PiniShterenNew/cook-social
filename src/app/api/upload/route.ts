// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { uploadFile } from '@/lib/storage';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    // המרה לבאפר
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // העלאה ל-Backblaze
    const fileName = file.name;
    const contentType = file.type;
    const fileUrl = await uploadFile(buffer, fileName, contentType);
    
    return NextResponse.json({ 
      success: true, 
      url: fileUrl 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: 'Upload failed' 
    }, { status: 500 });
  }
}