'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, Loader2 } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    uid: string;
    email: string;
    displayName?: string;
  } | null;
}

export function FeedbackModal({ isOpen, onClose, user }: FeedbackModalProps) {
  const { lang } = useLanguage();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Translations
  const t = {
    uz: {
      title: "Izoh qoldiring",
      desc: "Taklif-Time xizmatidan qoniqdingizmi? Sizning fikringiz biz uchun juda muhim va loyihani rivojlantirishga yordam beradi.",
      placeholder: "Fikringiz yoki taklifingizni yozing...",
      cancel: "Bekor qilish",
      submit: "Yuborish",
      submitting: "Yuborilmoqda...",
      thanks: "Katta rahmat! 🎉",
      thanksDesc: "Sizning fikringiz qabul qilindi. Biz bilan ekanligingizdan xursandmiz!",
      close: "Yopish"
    },
    ru: {
      title: "Оставьте отзыв",
      desc: "Вам понравился сервис TaklifGo? Ваше мнение очень важно для нас и поможет улучшить платформу.",
      placeholder: "Напишите ваши мысли или предложения...",
      cancel: "Отмена",
      submit: "Отправить",
      submitting: "Отправка...",
      thanks: "Огромное спасибо! 🎉",
      thanksDesc: "Ваш отзыв принят. Мы рады, что вы с нами!",
      close: "Закрыть"
    },
    en: {
      title: "Leave Feedback",
      desc: "Are you satisfied with TaklifGo? Your feedback is very important to us and will help us improve.",
      placeholder: "Write your thoughts or suggestions...",
      cancel: "Cancel",
      submit: "Submit",
      submitting: "Submitting...",
      thanks: "Thank you so much! 🎉",
      thanksDesc: "Your feedback has been received. We're glad to have you with us!",
      close: "Close"
    }
  };

  const l = t[lang] || t.uz;

  // Reset state when opened again after being closed (if not submitted)
  useEffect(() => {
    if (isOpen && !submitted) {
      setRating(0);
      setComment('');
    }
  }, [isOpen, submitted]);

  const handleSubmit = async () => {
    if (!user || rating === 0) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          userEmail: user.email,
          userName: user.displayName || '',
          rating,
          text: comment
        })
      });

      if (res.ok) {
        setSubmitted(true);
        // Mark in localStorage so we don't auto-show again
        localStorage.setItem('hasLeftFeedback', 'true');
      } else {
        console.error('Failed to submit feedback');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        if (submitted) {
          // Reset submitted state after close animation finishes
          setTimeout(() => setSubmitted(false), 500);
        }
      }
    }}>
      <DialogContent className="sm:max-w-md bg-[#faf9f6] border-[#98a08d]/20 rounded-3xl p-6">
        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-green-500 fill-green-500" />
            </div>
            <DialogTitle className="text-2xl font-serif text-[#5c6352]">{l.thanks}</DialogTitle>
            <DialogDescription className="text-[#7a8270] text-base">
              {l.thanksDesc}
            </DialogDescription>
            <Button
              onClick={onClose}
              className="mt-6 bg-[#98a08d] hover:bg-[#5c6352] text-white rounded-full px-8 py-2"
            >
              {l.close}
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif text-[#5c6352]">{l.title}</DialogTitle>
              <DialogDescription className="text-[#7a8270] mt-2">
                {l.desc}
              </DialogDescription>
            </DialogHeader>

            <div className="py-6 flex flex-col items-center gap-6">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 transition-all hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`w-10 h-10 transition-colors duration-200 ${star <= (hoveredRating || rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                        }`}
                    />
                  </button>
                ))}
              </div>

              <Textarea
                placeholder={l.placeholder}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="resize-none h-28 rounded-xl border-[#98a08d]/30 focus-visible:ring-[#98a08d]/50 bg-white"
              />
            </div>

            <DialogFooter className="flex gap-3 sm:justify-end">
              <Button
                variant="outline"
                onClick={onClose}
                className="rounded-full border-[#98a08d]/30 text-[#5c6352] hover:bg-[#98a08d]/10"
                disabled={isSubmitting}
              >
                {l.cancel}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={rating === 0 || isSubmitting}
                className="rounded-full bg-[#98a08d] hover:bg-[#5c6352] text-white"
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? l.submitting : l.submit}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
