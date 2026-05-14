"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  CheckCircle2,
  Copy,
  Share2,
  ExternalLink,
  ArrowLeft,
  QrCode,
  Send,
  Loader2,
  Phone,
  Eye,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/lib/LanguageContext";

export default function SuccessPage() {
  const { id } = useParams();
  const router = useRouter();
  const { lang } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const invitationUrl =
    typeof window !== "undefined"
      ? `${window.location.origin.includes('localhost') ? 'https://taklif-go.vercel.app' : window.location.origin}/invitation/${id}`
      : "https://taklif-go.vercel.app";

  useEffect(() => {
    if (!id) return;

    const docRef = doc(db, "invitations", id as string);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setData(docSnap.data());
      }
      setLoading(false);
    }, (error) => {
      console.error("Error listening to invitation:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(invitationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToTelegram = () => {
    let message = "";
    if (lang === "uz") {
      message = `Assalomu Aleykum !\nSizni bizning eng baxtli kunimizda kutib qolamiz!\n\nTaklifnomani ochish uchun bosing 💌\n\nHavola: ${invitationUrl}`;
    } else if (lang === "ru") {
      message = `Здравствуйте !\nПриглашаем вас на наш самый счастливый день!\n\nНажмите, чтобы открыть приглашение 💌\n\nСсылка: ${invitationUrl}`;
    } else {
      message = `Hello !\nWe invite you to our most special day!\n\nClick to open the invitation 💌\n\nLink: ${invitationUrl}`;
    }

    const telegramUrl = `https://t.me/share/url?text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#98a08d] animate-spin" />
      </div>
    );
  }

  const isPending = data?.status === "pending";
  const isRejected = data?.status === "rejected";

  return (
    <div className="min-h-screen bg-[#faf9f6] p-6 lg:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="text-[#98a08d] hover:text-white hover:bg-[#98a08d] -ml-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {lang === "uz"
              ? "Profilga qaytish"
              : lang === "ru"
                ? "Вернуться в профиль"
                : "Back to Dashboard"}
          </Button>
          <div
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border ${
              isPending
                ? "bg-[#d97706]/5 text-[#d97706] border-[#d97706]/20"
                : isRejected
                  ? "bg-red-50 text-red-600 border-red-200"
                  : "bg-[#98a08d]/5 text-[#98a08d] border-[#98a08d]/20"
            }`}
          >
            {isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                {lang === "uz"
                  ? "KO'RILMOQDA"
                  : lang === "ru"
                    ? "НА ПРОВЕРКЕ"
                    : "UNDER REVIEW"}
              </>
            ) : isRejected ? (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                {lang === "uz" ? "RAD ETILDI" : lang === "ru" ? "ОТКЛОНЕНО" : "REJECTED"}
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                {lang === "uz" ? "FAOL" : lang === "ru" ? "АКТИВЕН" : "ACTIVE"}
              </>
            )}
          </div>
        </div>

        {/* Status Message */}
        <div className="text-center space-y-4 py-8">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
              isPending ? "bg-[#d97706]/10" : isRejected ? "bg-red-50" : "bg-[#98a08d]/10"
            }`}
          >
            {isPending ? (
              <Loader2 className="w-10 h-10 text-[#d97706] animate-spin" />
            ) : isRejected ? (
              <XCircle className="w-10 h-10 text-red-600" />
            ) : (
              <CheckCircle2 className="w-10 h-10 text-[#98a08d]" />
            )}
          </div>
          <h1 className="text-4xl lg:text-5xl font-serif text-[#5c6352]">
            {isPending
              ? lang === "uz"
                ? "To'lov tekshirilmoqda"
                : lang === "ru"
                  ? "Оплата проверяется"
                  : "Payment under review"
              : isRejected
                ? lang === "uz"
                  ? "To'lov rad etildi"
                  : "Оплата отклонена"
                : lang === "uz"
                  ? "Tabriklaymiz!"
                  : lang === "ru"
                    ? "Поздравляем!"
                    : "Congratulations!"}
          </h1>

          {isRejected && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 my-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <p className="text-red-600 font-bold mb-1">
                {lang === "uz" ? "SABAB:" : "ПРИЧИНА:"}
              </p>
              <p className="text-red-800 text-lg">
                {data?.rejectReason || (lang === "uz" ? "Chek yaroqsiz yoki ma'lumotlar xato." : "Чек недействителен или данные неверны.")}
              </p>
            </div>
          )}

          {!isRejected && (
            <p className="text-[#98a08d] max-w-md mx-auto">
              {isPending
                ? lang === "uz"
                  ? "Sizning to'lovingiz 5 daqiqa ichida ko'rib chiqiladi. Havola tasdiqlangandan so'ng faollashadi."
                  : lang === "ru"
                    ? "Ваш платеж будет проверен в v techeniye 5 minut. Ссылка станет активной posle подтверждения."
                    : "Your payment will be reviewed within 5 minutes. The link will become active after approval."
                : lang === "uz"
                  ? "Sizning 3D taklifnomangiz muvaffaqiyatli yaratildi va hozirda butun dunyo uchun ochiq."
                  : lang === "ru"
                    ? "Ваше 3D-приглашение успешно создано и теперь доступно для всего мира."
                    : "Your 3D invitation has been successfully created and is now live for the world to see."}
            </p>
          )}

          {(isPending || isRejected) && (
            <div className="pt-4 space-y-4">
              <div className="inline-flex items-center gap-2 text-sm text-[#5c6352] font-bold p-3 bg-white rounded-2xl shadow-sm border border-[#98a08d]/10">
                <Phone className="w-4 h-4 text-[#98a08d]" />
                +998 90 123 45 67
              </div>
              <p className="text-[10px] text-[#98a08d] italic">
                {isRejected 
                  ? (lang === "uz" ? "Iltimos, qayta to'lov qiling va chekni yuklang yoki bog'laning." : "Пожалуйста, попробуйте снова или свяжитесь с нами.")
                  : (lang === "uz"
                    ? "Agar 5 daqiqadan ko'p vaqt o'tsa, yuqoridagi raqamga bog'laning."
                    : "Если прошло более 5 минут, пожалуйста, свяжитесь по номеру выше.")}
              </p>
              {isRejected && (
                <Button
                  onClick={() => router.push(`/create/${id}`)}
                  className="rounded-full bg-[#98a08d] text-white hover:bg-[#868d7c]"
                >
                  {lang === "uz" ? "Qayta urinish" : "Попробовать снова"}
                </Button>
              )}
              {isPending && (
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="rounded-full border-[#98a08d]/20 text-[#98a08d] hover:bg-[#98a08d] hover:text-white transition-all"
                >
                  {lang === "uz" ? "Sahifani yangilash" : "Обновить страницу"}
                </Button>
              )}
            </div>
          )}
        </div>

        {!isPending && !isRejected && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in duration-700">
            {/* Main Card */}
            <Card className="lg:col-span-2 p-8 rounded-[2.5rem] border-0 shadow-2xl space-y-8 bg-white">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#98a08d] tracking-[0.2em] uppercase">
                  {lang === "uz"
                    ? "Taklifnoma Havolasi"
                    : lang === "ru"
                      ? "Ссылка на Приглашение"
                      : "Invitation Link"}
                </h3>
                <div className="flex items-center gap-2 p-4 bg-[#faf9f6] rounded-2xl border border-[#98a08d]/10">
                  <input
                    readOnly
                    value={invitationUrl}
                    className="bg-transparent border-0 outline-none flex-1 text-sm text-[#5c6352] font-mono"
                  />
                  <Button
                    onClick={copyToClipboard}
                    size="sm"
                    className={
                      copied
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-[#98a08d] hover:bg-[#868d7c]"
                    }
                  >
                    {copied ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={shareToTelegram}
                  variant="outline"
                  className="rounded-2xl py-8 border-[#98a08d]/20 text-[#98a08d] hover:bg-[#98a08d] hover:text-white transition-all gap-3"
                >
                  <Send className="w-5 h-5" />
                  Telegram orqali yuborish
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(invitationUrl, "_blank")}
                  className="rounded-2xl py-8 border-[#98a08d]/20 text-[#98a08d] hover:bg-[#98a08d] hover:text-white transition-all gap-3"
                >
                  <ExternalLink className="w-5 h-5" />
                  Ko'rib chiqish
                </Button>
              </div>
            </Card>

            {/* Quick Stats/Info */}
            <div className="space-y-6">
              <Card className="p-8 rounded-[2.5rem] border-0 shadow-xl bg-white text-center space-y-4">
                <div className="w-12 h-12 bg-[#98a08d]/10 rounded-full flex items-center justify-center mx-auto">
                  <Eye className="w-6 h-6 text-[#98a08d]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-3xl font-bold text-[#5c6352]">0</h4>
                  <p className="text-xs text-[#98a08d] uppercase tracking-widest font-bold">
                    {lang === "uz"
                      ? "Ko'rishlar"
                      : lang === "ru"
                        ? "Просмотры"
                        : "Views"}
                  </p>
                </div>
              </Card>

              <Card className="p-8 rounded-[2.5rem] border-0 shadow-xl bg-white text-center space-y-4">
                <QrCode className="w-12 h-12 text-[#98a08d] mx-auto opacity-20" />
                <div className="space-y-1">
                  <h4 className="font-bold text-[#5c6352]">QR Kod</h4>
                  <p className="text-xs text-[#98a08d]">
                    Tez orada faollashadi
                  </p>
                </div>
              </Card>

              <Card className="p-8 rounded-[2.5rem] border-0 shadow-xl bg-[#98a08d] text-white space-y-2">
                <Share2 className="w-8 h-8 opacity-50" />
                <h4 className="font-bold text-lg leading-tight">
                  Taklifnomangizni dunyoga ko'rsating
                </h4>
                <p className="text-white/70 text-xs">
                  Havolani ulashish orqali mehmonlaringizni hayratda qoldiring.
                </p>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
