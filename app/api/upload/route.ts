import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";
// maxDuration yo'q — Hobby plan 10s limit, audio uchun ishlatmaymiz

cloudinary.config({
  cloud_name: "dlwrrxcjg",
  api_key: "658441217362522",
  api_secret: "xQHAQAWWEbQPw72C65s_kEL1yH0",
});

// ✅ Yangi endpoint: client uchun Cloudinary signed upload params beradi
// Audio to'g'ridan-to'g'ri browserdan Cloudinary ga ketadi — server timeout yo'q
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const resourceType = searchParams.get("resource_type") || "image";

  const folder =
    resourceType === "video" ? "invitations/audio" : "invitations/images";
  const timestamp = Math.round(Date.now() / 1000);

  const paramsToSign: Record<string, string | number> = {
    folder,
    timestamp,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET || "xQHAQAWWEbQPw72C65s_kEL1yH0",
  );

  return NextResponse.json({
    signature,
    timestamp,
    folder,
    api_key: process.env.CLOUDINARY_API_KEY || "658441217362522",
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dlwrrxcjg",
  });
}

// Rasmlar uchun (kichik fayllar, 10s da ulguriladi) server orqali
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const { file, resource_type = "image" } = await request.json();
      if (!file) {
        return NextResponse.json(
          { success: false, error: "No file provided" },
          { status: 400 },
        );
      }
      const folder = "invitations/images";
      const uploadResponse = await cloudinary.uploader.upload(file, {
        folder,
        resource_type: "image",
        quality: "auto",
        fetch_format: "auto",
      });
      return NextResponse.json({
        success: true,
        url: uploadResponse.secure_url,
        public_id: uploadResponse.public_id,
      });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "invitations/images",
          transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      uploadStream.end(buffer);
    });

    const uploadResult = result as any;
    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      format: uploadResult.format,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Upload failed" },
      { status: 500 },
    );
  }
}
