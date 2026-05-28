export const TEMPLATES_BY_CATEGORY: Record<string, { id: string; name: string; color: string }[]> = {
  wedding: [
    { id: "eternal-bond", name: "Eternal Bond", color: "bg-[#98a08d]" },
    { id: "golden-night", name: "Golden Night", color: "bg-[#D4AF37]" },
    { id: "nafosat", name: "Royal Azure", color: "bg-[#1a56a0]" },
    { id: "golden-wedding", name: "Golden Grace", color: "bg-[#8B6B23]" },
    { id: "royal-teal", name: "Royal Elegance", color: "bg-[#184C59]" },
    { id: "islamic-wedding", name: "Islamic Grace", color: "bg-[#7a9cd0]" },
    { id: "video-wedding", name: "Cinematic Love", color: "bg-[#2d2d2d]" },
    { id: "story-wedding", name: "Story Video", color: "bg-[#111111]" },
  ],
  birthday: [
    { id: "elegant-birthday", name: "Elegant Gold", color: "bg-[#D4AF37]" },
    { id: "girl-birthday", name: "Princess Pink", color: "bg-[#FF6FB4]" },
    { id: "magic-birthday", name: "Magic Celebration", color: "bg-[#f9a0b8]" },
  ],
  farewell: [
    { id: "nafosat", name: "Royal Azure", color: "bg-[#1a56a0]" },
  ],
  business: [
    { id: "corporate-event", name: "Corporate Event", color: "bg-[#0a4a8f]" },
  ],
  date: [
    { id: "date-invitation", name: "Romantic Date", color: "bg-[#b07050]" },
  ],
};
