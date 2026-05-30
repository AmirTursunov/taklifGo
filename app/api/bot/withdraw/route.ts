import { NextRequest, NextResponse } from "next/server";

const FIREBASE_API_KEY = "AIzaSyAi7LtxLWbaVaEMGyu9JpY8T_4045GjzLQ";
const PROJECT_ID = "invitation-28b16";
const BASE_REST_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8917648922:AAFKV2N9sN8rCqHOqCFMM9wzazX02i-_VyI";
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || "897270560095"; // Make sure CHAT_ID is correct from env

export async function POST(request: NextRequest) {
  try {
    const { uid, email, cardNumber, amount } = await request.json();

    if (!uid || !cardNumber || !amount) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Verify balance
    const userRes = await fetch(`${BASE_REST_URL}/users/${uid}?key=${FIREBASE_API_KEY}`);

    if (userRes.status === 404) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const doc = await userRes.json();
    const currentBalance = parseInt(doc.fields?.balance?.integerValue || "0", 10);
    
    if (currentBalance < amount) {
      return NextResponse.json({ success: false, error: "Insufficient balance" }, { status: 400 });
    }

    const newBalance = currentBalance - amount;

    // Deduct balance
    await fetch(`${BASE_REST_URL}/users/${uid}?key=${FIREBASE_API_KEY}&updateMask.fieldPaths=balance`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        fields: { balance: { integerValue: newBalance.toString() } } 
      })
    });

    const message = 
      `💸 *Pul Yechish So'rovi!*\n\n` +
      `📧 *User:* ${email || uid}\n` +
      `💳 *Karta:* \`${cardNumber}\`\n` +
      `💰 *Summa:* ${amount.toLocaleString()} UZS`;

    // Send to admin via telegram
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    const result = await response.json();
    if (!result.ok) {
      // Revert balance if telegram fails
      await fetch(`${BASE_REST_URL}/users/${uid}?key=${FIREBASE_API_KEY}&updateMask.fieldPaths=balance`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fields: { balance: { integerValue: currentBalance.toString() } } 
        })
      });
      return NextResponse.json({ success: false, error: "Failed to notify admin" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Withdrawal error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
