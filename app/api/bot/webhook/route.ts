import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase"; // Using the same db instance
import { doc, updateDoc, getDoc } from "firebase/firestore";

const BOT_TOKEN = "8917648922:AAFKV2N9sN8rCqHOqCFMM9wzazX02i-_VyI";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Handle Callback Queries (Buttons)
    if (body.callback_query) {
      const { data, message, id: callbackQueryId } = body.callback_query;
      const chatId = message.chat.id;
      const messageId = message.message_id;

      if (data.startsWith("confirm_")) {
        const invitationId = data.replace("confirm_", "");
        
        // Update Firestore
        const docRef = doc(db, "invitations", invitationId);
        await updateDoc(docRef, { status: "active" });

        // Get invitation data to notify user
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const invData = docSnap.data();
          if (invData.telegramId) {
            await sendTelegramMessage(invData.telegramId, "✅ Tabriklaymiz! To'lovingiz tasdiqlandi va taklifnomangiz faollashtirildi.");
          }
        }

        // Notify Admin and update keyboard
        await editTelegramMessage(chatId, messageId, message.caption + "\n\n✅ *TASDIQLANDI*", null);
        await answerCallbackQuery(callbackQueryId, "Buyurtma tasdiqlandi!");
      }

      if (data.startsWith("reject_")) {
        const invitationId = data.replace("reject_", "");
        
        // Ask for reason
        await sendTelegramMessage(chatId, `❌ Bekor qilish sababini yozing (ID: ${invitationId}):`, {
          force_reply: true,
          selective: true
        });
        
        await answerCallbackQuery(callbackQueryId, "Sababini kutilmoqda...");
      }

      return NextResponse.json({ ok: true });
    }

    // Handle Replies (Rejection Reason)
    if (body.message && body.message.reply_to_message) {
      const replyText = body.message.reply_to_message.text;
      const reason = body.message.text;
      const chatId = body.message.chat.id;

      // Extract ID from prompt "❌ Bekor qilish sababini yozing (ID: ...):"
      const idMatch = replyText.match(/ID: ([\w-]+)/);
      if (idMatch) {
        const invitationId = idMatch[1];
        
        // Update Firestore
        const docRef = doc(db, "invitations", invitationId);
        await updateDoc(docRef, { status: "rejected", rejectReason: reason });

        // Get invitation data to notify user
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const invData = docSnap.data();
          if (invData.telegramId) {
            await sendTelegramMessage(invData.telegramId, `❌ Uzr, sizning to'lovingiz rad etildi.\n\n⚠️ *Sabab:* ${reason}\n\nIltimos, qayta urinib ko'ring yoki qo'llab-quvvatlash xizmati bilan bog'laning.`);
          }
        }

        await sendTelegramMessage(chatId, `✅ Rad etish sababi userga yuborildi. (ID: ${invitationId})`);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Helpers
async function sendTelegramMessage(chatId: string | number, text: string, extra = {}) {
  return fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: "Markdown",
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
      parse_mode: "Markdown",
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
