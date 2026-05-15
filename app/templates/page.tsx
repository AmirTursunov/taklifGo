"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, Heart, Gift, Briefcase, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  { 
    id: "wedding", 
    name: "Nikoh To'yi", 
    icon: Heart, 
    color: "text-rose-500", 
    bg: "bg-rose-50",
    count: 3
  },
  { 
    id: "birthday", 
    name: "Tug'ilgan Kun", 
    icon: Gift, 
    color: "text-amber-500", 
    bg: "bg-amber-50",
    count: 1
  },
  { 
    id: "farewell", 
    name: "Qiz Uzatish", 
    icon: Sparkles, 
    color: "text-purple-500", 
    bg: "bg-purple-50",
    count: 1
  },
  { 
    id: "business", 
    name: "Biznes Tadbir", 
    icon: Briefcase, 
    color: "text-blue-500", 
    bg: "bg-blue-50",
    count: 1
  },
];

export default function TemplatesPage() {
  const router = useRouter();

  const selectCategory = (catId: string) => {
    router.push(`/create?category=${catId}`);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#98a08d]/10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/")}
              className="text-[#98a08d] hover:bg-[#98a08d]/10 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-serif text-[#5c6352]">Shablonlar</h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-10 space-y-12">
        <div className="text-center space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-serif text-[#5c6352]"
          >
            O'zingizga mos toifani tanlang
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[#98a08d] max-w-lg mx-auto"
          >
            Har bir tadbir uchun maxsus ishlab chiqilgan premium dizaynlarimizdan birini tanlang.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              onClick={() => selectCategory(cat.id)}
              className="group bg-white p-8 rounded-[2rem] border border-[#98a08d]/10 shadow-lg hover:shadow-2xl transition-all cursor-pointer text-center space-y-4"
            >
              <div className={`w-16 h-16 mx-auto rounded-2xl ${cat.bg} flex items-center justify-center`}>
                <cat.icon className={`w-8 h-8 ${cat.color}`} />
              </div>
              <h3 className="text-xl font-serif text-[#5c6352]">{cat.name}</h3>
              <p className="text-xs text-[#98a08d] font-medium tracking-wide">
                {cat.count} ta shablon
              </p>
              <div className="pt-2">
                <div className="inline-flex items-center gap-2 text-[#98a08d] group-hover:text-[#5c6352] transition-colors text-xs font-bold uppercase tracking-widest">
                  Tanlash <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
