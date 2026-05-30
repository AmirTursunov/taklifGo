'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export function ReferralTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      // Faqatgina yangi referral bo'lsa yoki oldingisini yangilasa
      const currentRef = localStorage.getItem('referredBy');
      if (currentRef !== ref) {
        localStorage.setItem('referredBy', ref);
        console.log('Referral id saved:', ref);
      }
    }
  }, [searchParams]);

  return null;
}
