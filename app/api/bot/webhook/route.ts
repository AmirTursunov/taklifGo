import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

const BOT_TOKEN = "8917648922:AAFKV2N9sN8rCqHOqCFMM9wzazX02i-_VyI";

export async function POST(request: NextRequest) {
  console.log("Webhook received a request");
  try {
    const body = await request.json();
    console.log("Webhook body:", JSON.stringify(body));

    if (body.callback_query) {
      const { data, message, id: callbackQueryId } = body.callback_query;
      const chatId = message.chat.id;
      const messageId = message.message_id;
      
      console.log(`Handling callback: ${data} for invitation`);

      if (data.startsWith("confirm_")) {
        const invitationId = data.replace("confirm_", "");
        console.log(`Confirming invitation: ${invitationId}`);
        
        const docRef = adminDb.collection("invitations").doc(invitationId);
        await docRef.update({ status: "active" });
        console.log("Firestore updated to active via Admin SDK");

        const docSnap = await docRef.get();
        if (docSnap.exists) {
          const invData = docSnap.data();
          if (invData?.telegramId) {
            await sendTelegramMessage(invData.telegramId, "<b>✅ Tabriklaymiz!</b>\n\nTo'lovingiz tasdiqlandi va taklifnomangiz faollashtirildi.");
          }
        }

        const newCaption = (message.caption || "") + "\n\n✅ <b>TASDIQLANDI</b>";
        await editTelegramMessage(chatId, messageId, newCaption, null);
        await answerCallbackQuery(callbackQueryId, "Tasdiqlandi!");
      }

      if (data.startsWith("reject_")) {
        const invitationId = data.replace("reject_", "");
        console.log(`Rejecting invitation: ${invitationId}`);
        
        await sendTelegramMessage(chatId, `❌ Bekor qilish sababini yozing (ID: ${invitationId}):`, {
          reply_markup: { force_reply: true, selective: true }
        });
        
        await answerCallbackQuery(callbackQueryId, "Sababi kutilmoqda...");
      }

      return NextResponse.json({ ok: true });
    }

    if (body.message && body.message.reply_to_message) {
      const replyText = body.message.reply_to_message.text;
      const reason = body.message.text;
      const chatId = body.message.chat.id;

      const idMatch = replyText.match(/ID: ([\w-]+)/);
      if (idMatch) {
        const invitationId = idMatch[1];
        console.log(`Processing rejection reason for: ${invitationId}`);
        
        const docRef = adminDb.collection("invitations").doc(invitationId);
        await docRef.update({ status: "rejected", rejectReason: reason });

        const docSnap = await docRef.get();
        if (docSnap.exists) {
          const invData = docSnap.data();
          if (invData?.telegramId) {
            await sendTelegramMessage(invData.telegramId, `<b>❌ Uzr, sizning to'lovingiz rad etildi.</b>\n\n⚠️ <b>Sabab:</b> ${reason}\n\nIltimos, qayta urinib ko'ring.`);
          }
        }

        await sendTelegramMessage(chatId, `✅ Rad etish sababi userga yuborildi. (ID: ${invitationId})`);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Webhook error details:", error);
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function sendTelegramMessage(chatId: string | number, text: string, extra = {}) {
  return fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: "HTML",
      ...extra,
    }),
  });
}

async function editTelegramMessage(chatId: string | number, messageId: number, caption: string, keyboard: any) {
  return fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageCaption`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
      caption: caption,
      parse_mode: "HTML",
      reply_markup: keyboard,
    }),
  });
}

async function answerCallbackQuery(callbackQueryId: string, text: string) {
  return fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      callback_query_id: callbackQueryId,
      text: text,
    }),
  });
}
