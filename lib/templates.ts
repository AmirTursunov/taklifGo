export const TEMPLATES_BY_CATEGORY: Record<string, { id: string; name: string; color: string; type?: "taklifnoma" | "tabriknoma" }[]> = {
  wedding: [
    { id: "eternal-bond", name: "Eternal Bond", color: "bg-[#98a08d]", type: "taklifnoma" },
    { id: "golden-night", name: "Golden Night", color: "bg-[#D4AF37]", type: "taklifnoma" },
    { id: "nafosat", name: "Royal Azure", color: "bg-[#1a56a0]", type: "taklifnoma" },
    { id: "golden-wedding", name: "Golden Grace", color: "bg-[#8B6B23]", type: "taklifnoma" },
    { id: "royal-teal", name: "Royal Elegance", color: "bg-[#184C59]", type: "taklifnoma" },
    { id: "islamic-wedding", name: "Islamic Grace", color: "bg-[#7a9cd0]", type: "taklifnoma" },
    { id: "video-wedding", name: "Cinematic Love", color: "bg-[#2d2d2d]", type: "taklifnoma" },
    { id: "story-wedding", name: "Story Video", color: "bg-[#111111]", type: "taklifnoma" },
    { id: "classic-wedding", name: "Classic Gold", color: "bg-[#d4a840]", type: "taklifnoma" },
  ],
  birthday: [
    { id: "birthday-greeting", name: "Tug'ilgan Kun Tabrigi", color: "bg-[#be185d]", type: "tabriknoma" },
    { id: "secret-birthday", name: "Maxfiy Tabrik", color: "bg-[#7c3aed]", type: "tabriknoma" },
    { id: "elegant-birthday", name: "Elegant Gold", color: "bg-[#D4AF37]", type: "taklifnoma" },
    { id: "girl-birthday", name: "Princess Pink", color: "bg-[#FF6FB4]", type: "taklifnoma" },
    { id: "magic-birthday", name: "Magic Celebration", color: "bg-[#f9a0b8]", type: "taklifnoma" },
  ],
  farewell: [
    { id: "nafosat", name: "Royal Azure", color: "bg-[#1a56a0]", type: "taklifnoma" },
  ],
  business: [
    { id: "corporate-event", name: "Corporate Event", color: "bg-[#0a4a8f]", type: "taklifnoma" },
  ],
  date: [
    { id: "date-invitation", name: "Romantic Date", color: "bg-[#b07050]", type: "taklifnoma" },
  ],
};
