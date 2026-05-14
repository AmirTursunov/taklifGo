import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: 'dlwrrxcjg',
  api_key: '658441217362522',
  api_secret: 'xQHAQAWWEbQPw72C65s_kEL1yH0',
});

export async function POST(request: Request) {
  try {
    const { public_id, resource_type = 'auto' } = await request.json();

    if (!public_id) {
      return NextResponse.json({ error: 'No public_id provided' }, { status: 400 });
    }

    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: resource_type,
    });

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('Cloudinary delete error:', error);
    return NextResponse.json({ 
      error: 'Delete failed', 
      details: error.message || error 
    }, { status: 500 });
  }
}
