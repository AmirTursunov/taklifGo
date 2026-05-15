"use client";

import { useState, useEffect } from "react";
import { EternalBondTemplate } from "@/components/templates/eternal-bond";
import { GoldenNightTemplate } from "@/components/templates/golden-night";
import { PRESET_MUSIC } from "@/lib/music";
import { useAuth } from "@/lib/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Share2,
  Eye,
  Save,
  Settings,
  Languages,
  Music,
  Loader2,
  CheckCircle2,
  CreditCard,
  Upload,
  Phone,
  ArrowLeft,
  Trash2,
  VolumeX,
  Info,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { Language } from "@/lib/translations";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";

export default function CreateInvitation() {
  const { t, lang, setLang } = useLanguage();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const [isSaving, setIsSaving] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentType, setPaymentType] = useState<"click" | "payme" | null>(
    null,
  );

  // ✅ Uploadlar darhol bo'ladi — handleSave da kutish yo'q
  const [isMusicUploading, setIsMusicUploading] = useState(false);
  const [isReceiptUploading, setIsReceiptUploading] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null); // tayyor Cloudinary URL
  const [receiptReady, setReceiptReady] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<
    Record<number, boolean>
  >({}); // index → loading
  const isAnyLoading = isSaving || isMusicUploading || isReceiptUploading || Object.values(uploadingImages).some(v => v);

  const [data, setData] = useState({
    names: "Sarah & James",
    date: "June 15, 2025",
    location: "Paris, France",
    venue: "Rose Mansion",
    musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    musicPublicId: "",
    images: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800",
    ],
    templateId: "eternal-bond",
  });

  // ✅ Barcha fayllarni FormData orqali yuklash (base64 JSON emas)
  // ─── Cloudinary direct upload (Vercel orqali o'tmaydi) ───────────────────────
  const uploadDirect = async (
    file: File | string,
    resourceType: "image" | "video" = "image",
  ): Promise<{ url: string; public_id: string }> => {
    const sigRes = await fetch(`/api/upload?resource_type=${resourceType}`);
    if (!sigRes.ok) throw new Error("Signature olishda xatolik");
    const { signature, timestamp, folder, api_key, cloud_name } =
      await sigRes.json();

    const formData = new FormData();
    if (typeof file === "string") {
      const res = await fetch(file);
      const blob = await res.blob();
      formData.append("file", blob);
    } else {
      formData.append("file", file);
    }
    formData.append("api_key", api_key);
    formData.append("timestamp", String(timestamp));
    formData.append("signature", signature);
    formData.append("folder", folder);

    const cloudRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloud_name}/${resourceType}/upload`,
      { method: "POST", body: formData },
    );
    const cloudData = await cloudRes.json();
    if (cloudData.error) throw new Error(cloudData.error.message);
    return { url: cloudData.secure_url, public_id: cloudData.public_id };
  };

  const handleMusicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      toast.error(
        lang === "uz"
          ? "Musiqa fayli hajmi 15 MB dan oshmasligi kerak!"
          : "Размер музыкального файла не должен превышать 15 МБ!",
      );
      e.target.value = "";
      return;
    }

    setIsMusicUploading(true);
    toast.info(t.uploadNotice);
    try {
      const { url, public_id } = await uploadDirect(file, "video");
      setData((prev) => ({ ...prev, musicUrl: url, musicPublicId: public_id }));
      toast.success(lang === "uz" ? "Musiqa yuklandi!" : "Музыка загружена!");
    } catch (error: any) {
      console.error("Music upload error:", error);
      toast.error(
        error.message ||
        (lang === "uz" ? "Xatolik yuz berdi" : "Произошла ошибка"),
      );
    } finally {
      setIsMusicUploading(false);
      e.target.value = "";
    }
  };

  const handleDeleteMusic = async () => {
    if (!data.musicPublicId) {
      setData((prev) => ({ ...prev, musicUrl: "", musicPublicId: "" }));
      return;
    }

    const toastId = toast.loading(
      lang === "uz" ? "Musiqa o'chirilmoqda..." : "Удаление музыки...",
    );
    try {
      const response = await fetch("/api/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          public_id: data.musicPublicId,
          resource_type: "video",
        }),
      });
      if (!response.ok) throw new Error("Delete failed");

      setData((prev) => ({ ...prev, musicUrl: "", musicPublicId: "" }));
      toast.update(toastId, {
        render: lang === "uz" ? "Musiqa o'chirildi!" : "Музыка удалена!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Music delete error:", error);
      toast.update(toastId, {
        render: lang === "uz" ? "Xatolik yuz berdi" : "Произошла ошибка",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  // ✅ Chek tanlanishi bilan DARHOL Cloudinary ga yuklaydi
  const handleReceiptUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error(
        lang === "uz"
          ? "Chek rasmi 10 MB dan kichik bo'lishi kerak!"
          : "Размер чека не должен превышать 10 МБ!",
      );
      e.target.value = "";
      return;
    }

    setIsReceiptUploading(true);
    setReceiptReady(false);
    try {
      // ✅ Server orqali yuklash (Client timeout oldini olish uchun)
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const result = await res.json();

      if (result.success) {
        setReceiptUrl(result.url);
        setReceiptReady(true);
        toast.success(lang === "uz" ? "Chek yuklandi!" : "Чек загружен!");
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      console.error("Receipt upload error:", err);
      toast.error(
        lang === "uz"
          ? "Chek yuklanmadi, qayta urinib ko'ring"
          : "Ошибка загрузки чека",
      );
    } finally {
      setIsReceiptUploading(false);
      e.target.value = "";
    }
  };

  const sendTelegramNotification = async (
    invitationId: string,
    receiptUrl: string,
  ) => {
    try {
      const response = await fetch("/api/bot/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId,
          receiptUrl,
          names: data.names,
          email: user?.email,
          paymentType,
          venue: data.venue,
          date: data.date,
          lang,
        }),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Notification failed");
      }
      console.log("Telegram notification sent successfully via server");
    } catch (e: any) {
      console.error("Telegram notification failed:", e);
      toast.error(
        lang === "uz"
          ? "Adminga xabar yuborishda xatolik (lekin buyurtma saqlandi)"
          : "Ошибка отправки уведомления (но заказ сохранен)",
      );
    }
  };

  // ✅ handleSave — hech qanday upload yo'q, faqat Firestore ga yozadi (tez!)
  const handleSave = async () => {
    if (!receiptReady || !receiptUrl) {
      toast.warning(
        lang === "uz"
          ? "Iltimos, chek yuklanishini kuting yoki qayta tanlang"
          : "Пожалуйста, дождитесь загрузки чека",
      );
      return;
    }
    if (!paymentType) {
      toast.warning(
        lang === "uz" ? "To'lov turini tanlang" : "Выберите тип оплаты",
      );
      return;
    }
    // Hali base64 bo'lib qolgan rasm bormi tekshiramiz
    const stillUploading = data.images.some((img) =>
      img.startsWith("data:image"),
    );
    if (stillUploading) {
      toast.warning(
        lang === "uz"
          ? "Rasmlar hali yuklanmoqda, biroz kuting..."
          : "Изображения ещё загружаются...",
      );
      return;
    }

    setIsSaving(true);
    try {
      // ✅ Telegram Mini App orqali foydalanuvchi ID sini olish
      const tgId = (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id;

      const docRef = await addDoc(collection(db, "invitations"), {
        ...data,
        musicUrl: data.musicUrl,
        receiptUrl,
        paymentType,
        userId: user?.uid,
        telegramId: tgId || null,
        status: "pending",
        createdAt: serverTimestamp(),
        lang,
      });

      await sendTelegramNotification(docRef.id, receiptUrl);

      toast.success(
        lang === "uz" ? "Taklifnoma saqlandi!" : "Приглашение сохранено!",
      );
      router.push(`/success/${docRef.id}`);
    } catch (error: any) {
      console.error("Error saving invitation:", error);
      toast.error(
        error.message ||
        (lang === "uz" ? "Xatolik yuz berdi" : "Произошла ошибка"),
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#98a08d] animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#faf9f6]">
      <aside className="w-full lg:w-[400px] bg-white border-r border-[#98a08d]/10 flex flex-col z-20 shadow-xl">
        <div className="p-6 border-b border-[#98a08d]/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => router.push("/")}
              className="text-[#98a08d] hover:text-[#5c6352] hover:bg-[#98a08d]/10 rounded-full"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-serif text-[#5c6352]">
              {t.builderTitle}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex p-0.5 bg-[#98a08d]/5 rounded-full border border-[#98a08d]/10">
              {(["uz", "ru", "en"] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2 py-1 rounded-full text-[10px] font-bold transition-all ${lang === l
                    ? "bg-[#98a08d] text-white"
                    : "text-[#98a08d] hover:bg-[#98a08d]/10"
                    }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <section className="space-y-4">
            <h3 className="text-[10px] tracking-[0.3em] text-[#98a08d] font-bold uppercase">
              {lang === "uz" ? "Dizayn" : lang === "ru" ? "Дизайн" : "Design"}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "eternal-bond", name: "Eternal Bond", color: "bg-[#98a08d]" },
                { id: "golden-night", name: "Golden Night", color: "bg-[#D4AF37]" },
              ].map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => setData({ ...data, templateId: tmpl.id })}
                  className={`relative p-3 rounded-xl border text-center transition-all ${
                    data.templateId === tmpl.id
                      ? "border-[#98a08d] bg-[#98a08d]/5 ring-2 ring-[#98a08d]/20"
                      : "border-[#98a08d]/10 hover:border-[#98a08d]/30"
                  }`}
                >
                  <div className={`w-full h-12 rounded-lg mb-2 ${tmpl.color} opacity-40`} />
                  <span className="text-[10px] font-bold text-[#5c6352]">{tmpl.name}</span>
                  {data.templateId === tmpl.id && (
                    <div className="absolute -top-1 -right-1 bg-[#98a08d] text-white rounded-full p-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-[10px] tracking-[0.3em] text-[#98a08d] font-bold uppercase">
              {t.basicInfo}
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t.coupleNames}</Label>
                <Input
                  value={data.names}
                  onChange={(e) => setData({ ...data, names: e.target.value })}
                  className="rounded-xl border-[#98a08d]/20"
                />
              </div>
              <div className="space-y-2">
                <Label>{t.weddingDate}</Label>
                <Input
                  value={data.date}
                  onChange={(e) => setData({ ...data, date: e.target.value })}
                  className="rounded-xl border-[#98a08d]/20"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-[10px] tracking-[0.3em] text-[#98a08d] font-bold uppercase">
              {lang === "uz"
                ? "Joylashuv"
                : lang === "ru"
                  ? "Местоположение"
                  : "Location"}
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t.venueName}</Label>
                <Input
                  value={data.venue}
                  onChange={(e) => setData({ ...data, venue: e.target.value })}
                  className="rounded-xl border-[#98a08d]/20"
                />
              </div>
              <div className="space-y-2">
                <Label>{t.location}</Label>
                <Input
                  value={data.location}
                  onChange={(e) =>
                    setData({ ...data, location: e.target.value })
                  }
                  className="rounded-xl border-[#98a08d]/20"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-[10px] tracking-[0.3em] text-[#98a08d] font-bold uppercase">
              {lang === "uz" ? "Musiqa" : lang === "ru" ? "Музыка" : "Music"}
            </h3>
            <div className="space-y-4">
              <div className="space-y-4">
                <Label className="flex items-center gap-2">
                  <Music className="w-4 h-4" />
                  {lang === "uz"
                    ? "Musiqa tanlang"
                    : lang === "ru"
                      ? "Выберите музыку"
                      : "Select Music"}
                </Label>

                <div className="space-y-3">
                  <Select
                    value={data.musicUrl || "none"}
                    onValueChange={(val) => setData({ ...data, musicUrl: val, musicPublicId: "" })}
                  >
                    <SelectTrigger className="w-full rounded-xl border-[#98a08d]/20 bg-white">
                      <SelectValue placeholder={t.selectMusic} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-[#98a08d]/10">
                      <SelectItem value="none">
                        <div className="flex items-center gap-2">
                          <VolumeX className="w-4 h-4" />
                          {t.noMusic}
                        </div>
                      </SelectItem>
                      {PRESET_MUSIC.map((music) => (
                        <SelectItem key={music.id} value={music.url}>
                          <div className="flex items-center gap-2">
                            <Music className="w-4 h-4" />
                            {(t as any)[music.name] || music.id}
                          </div>
                        </SelectItem>
                      ))}
                      {data.musicUrl && data.musicUrl !== "none" && !PRESET_MUSIC.some(m => m.url === data.musicUrl) && (
                        <SelectItem value={data.musicUrl}>
                          <div className="flex items-center gap-2">
                            <Music className="w-4 h-4" />
                            {lang === "uz" ? "Maxsus musiqa" : "Своя музыка"}
                          </div>
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] text-[#98a08d] uppercase tracking-wider font-bold block">
                      {t.uploadOwnMusic}
                    </Label>
                    <div className="group relative">
                      <Info className="w-3.5 h-3.5 text-[#98a08d] cursor-help" />
                      <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-[#5c6352] text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                        {t.uploadNotice}
                        <div className="absolute top-full right-2 border-4 border-transparent border-t-[#5c6352]" />
                      </div>
                    </div>
                  </div>
                  {data.musicUrl && data.musicUrl !== "none" && !PRESET_MUSIC.some(m => m.url === data.musicUrl) ? (
                    <div className="flex items-center justify-between bg-[#98a08d]/5 p-3 rounded-xl border border-[#98a08d]/20">
                      <span className="text-xs text-[#5c6352] font-medium truncate max-w-[200px]">
                        {lang === "uz" ? "Maxsus musiqa" : "Своя музыка"}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDeleteMusic}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 p-0 h-8 w-8 rounded-full"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="relative">
                      <Input
                        type="file"
                        accept="audio/*"
                        onChange={handleMusicUpload}
                        disabled={isMusicUploading}
                        className="rounded-xl border-[#98a08d]/20 file:bg-[#98a08d] file:text-white file:border-0 file:rounded-lg file:px-3 file:py-1 file:mr-4 file:text-[10px] file:cursor-pointer disabled:opacity-50"
                      />
                      {isMusicUploading && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Loader2 className="w-4 h-4 text-[#98a08d] animate-spin" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4 pt-4 border-t border-[#98a08d]/10">
            <Button
              onClick={() => setShowPaymentModal(true)}
              disabled={isAnyLoading}
              className="w-full bg-[#98a08d] hover:bg-[#868d7c] text-white rounded-xl py-6 flex items-center gap-2 disabled:opacity-50"
            >
              <Share2 className="w-4 h-4" />
              {t.generateLink}
            </Button>
            <p className="text-[10px] text-center text-[#98a08d] italic">
              {t.paymentNotice}
            </p>
          </section>
        </div>
      </aside>

      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-[400px] rounded-[2rem] border-0 shadow-2xl bg-[#faf9f6]">
          <DialogHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-[#98a08d]/10 rounded-full flex items-center justify-center mx-auto">
              <CreditCard className="w-8 h-8 text-[#98a08d]" />
            </div>
            <DialogTitle className="text-2xl font-serif text-[#5c6352]">
              {lang === "uz"
                ? "To'lovni amalga oshiring"
                : lang === "ru"
                  ? "Произведите оплату"
                  : "Complete Payment"}
            </DialogTitle>
            <DialogDescription className="text-[#98a08d] text-sm">
              {lang === "uz"
                ? "Taklifnomani faollashtirish va havola olish uchun to'lov qiling"
                : lang === "ru"
                  ? "Оплатите, чтобы активировать приглашение и получить ссылку"
                  : "Pay to activate the invitation and get the link"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex gap-4">
              <div
                onClick={() => setPaymentType("click")}
                className={`flex-1 p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-center gap-2 ${paymentType === "click"
                  ? "bg-[#98a08d]/10 border-[#98a08d]"
                  : "bg-white border-[#98a08d]/10 hover:border-[#98a08d]"
                  }`}
              >
                <div className="w-10 h-10 bg-[#4a5568]/10 rounded-xl flex items-center justify-center font-bold text-[#4a5568]">
                  C
                </div>
                <span className="font-bold text-[#5c6352] text-sm">Click</span>
                {paymentType === "click" && (
                  <CheckCircle2 className="w-4 h-4 text-[#98a08d]" />
                )}
              </div>
              <div
                onClick={() => setPaymentType("payme")}
                className={`flex-1 p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-center gap-2 ${paymentType === "payme"
                  ? "bg-[#98a08d]/10 border-[#98a08d]"
                  : "bg-white border-[#98a08d]/10 hover:border-[#98a08d]"
                  }`}
              >
                <div className="w-10 h-10 bg-[#98a08d]/10 rounded-xl flex items-center justify-center font-bold text-[#98a08d]">
                  P
                </div>
                <span className="font-bold text-[#5c6352] text-sm">Payme</span>
                {paymentType === "payme" && (
                  <CheckCircle2 className="w-4 h-4 text-[#98a08d]" />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-[#98a08d] uppercase tracking-wider font-bold flex items-center gap-2">
                <Upload className="w-3 h-3" />
                {lang === "uz"
                  ? "To'lov chekini yuklang"
                  : "Загрузите чек оплаты"}
              </Label>
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleReceiptUpload}
                  disabled={isReceiptUploading}
                  className="rounded-xl border-[#98a08d]/20 text-xs disabled:opacity-50"
                />
                {isReceiptUploading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <Loader2 className="w-4 h-4 text-[#98a08d] animate-spin" />
                    <span className="text-[10px] text-[#98a08d]">
                      {lang === "uz" ? "Yuklanmoqda..." : "Загрузка..."}
                    </span>
                  </div>
                )}
              </div>
              {receiptReady && (
                <p className="text-[10px] text-green-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />{" "}
                  {lang === "uz" ? "Chek yuklandi ✓" : "Чек загружен ✓"}
                </p>
              )}
            </div>

            <div className="p-4 bg-[#98a08d]/5 rounded-2xl border border-[#98a08d]/10 space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-[#98a08d] rounded-full mt-1 animate-pulse" />
                <p className="text-[11px] text-[#5c6352] leading-relaxed font-medium">
                  {lang === "uz"
                    ? "To'lov 5 daqiqa ichida tekshiriladi va taklifnoma faollashtiriladi."
                    : "Оплата будет проверена в течение 5 минут, после чего приглашение будет активировано."}
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-[#98a08d] font-bold">
                <Phone className="w-3 h-3" />
                {lang === "uz"
                  ? "Bog'lanish uchun: +998 90 123 45 67"
                  : "Для связи: +998 90 123 45 67"}
              </div>
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold text-[#5c6352]">25,000 UZS</p>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleSave}
              disabled={isAnyLoading}
              className="w-full bg-[#98a08d] hover:bg-[#868d7c] text-white rounded-xl py-6 flex items-center justify-center gap-2"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {lang === "uz"
                ? "To'lovni Tasdiqlash"
                : lang === "ru"
                  ? "Подтвердить Оплату"
                  : "Confirm Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <main className="flex-1 relative bg-[#f8f7f4] overflow-hidden min-h-[500px] lg:h-screen flex flex-col">
        <div className="absolute top-6 left-6 z-30 flex flex-col gap-2 items-start">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full shadow-md border border-[#98a08d]/10">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-[#5c6352] tracking-widest uppercase">
              {lang === "uz"
                ? "Jonli Ko'rinish"
                : lang === "ru"
                  ? "Предпросмотр"
                  : "Live Preview"}
            </span>
          </div>
        </div>

        <div className="flex-1 p-4 md:p-8 overflow-hidden">
          <div className="w-full h-full bg-white shadow-2xl rounded-[2rem] overflow-hidden border border-[#98a08d]/10">
            <div className="w-full h-full overflow-y-auto hide-scrollbar bg-[#faf9f6]">
              {data.templateId === "golden-night" ? (
                <GoldenNightTemplate
                  data={data}
                  onDataChange={async (newData) => {
                    if (newData.images) {
                      const updatedImages = [...(newData.images as string[])];
                      const uploadJobs = updatedImages.map(async (img, i) => {
                        if (img.startsWith("data:image")) {
                          setUploadingImages((prev) => ({ ...prev, [i]: true }));
                          try {
                            const { url } = await uploadDirect(img, "image");
                            updatedImages[i] = url;
                          } catch {
                          } finally {
                            setUploadingImages((prev) => ({ ...prev, [i]: false }));
                          }
                        }
                      });
                      await Promise.all(uploadJobs);
                      setData((prev) => ({ ...prev, ...newData, images: updatedImages }));
                    } else {
                      setData((prev) => ({ ...prev, ...newData }));
                    }
                  }}
                />
              ) : (
                <EternalBondTemplate
                  data={data}
                  onDataChange={async (newData) => {
                    if (newData.images) {
                      const updatedImages = [...(newData.images as string[])];
                      const uploadJobs = updatedImages.map(async (img, i) => {
                        if (img.startsWith("data:image")) {
                          setUploadingImages((prev) => ({ ...prev, [i]: true }));
                          try {
                            const { url } = await uploadDirect(img, "image");
                            updatedImages[i] = url;
                          } catch {
                          } finally {
                            setUploadingImages((prev) => ({ ...prev, [i]: false }));
                          }
                        }
                      });
                      await Promise.all(uploadJobs);
                      setData((prev) => ({ ...prev, ...newData, images: updatedImages }));
                    } else {
                      setData((prev) => ({ ...prev, ...newData }));
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
