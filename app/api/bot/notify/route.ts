import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { invitationId, receiptUrl, names, email, paymentType, venue, date, lang } = await request.json();

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    const message =
      `🚀 *Yangi Taklifnoma Buyurtmasi!*\n\n` +
      `📧 *Email:* ${email || "Noma'lum"}\n` +
      `💰 *Narx:* 25,000 UZS\n` +
      `💳 *To'lov turi:* ${paymentType?.toUpperCase()}\n` +
      `🔗 *ID:* \`${invitationId}\``;

    const keyboard = {
      inline_keyboard: [
        [
          { text: "✅ Tasdiqlash", callback_data: `confirm_${invitationId}` },
          { text: "❌ Bekor qilish", callback_data: `reject_${invitationId}` },
        ],
      ],
    };

    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        photo: receiptUrl,
        caption: message,
        parse_mode: "Markdown",
        reply_markup: keyboard,
      }),
    });

    const result = await response.json();
    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.description }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Notification error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
