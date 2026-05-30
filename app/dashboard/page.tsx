'use client'

import { useEffect, useState, useMemo } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { db, auth } from '@/lib/firebase'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { updateProfile, sendPasswordResetEmail } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Plus,
  ExternalLink,
  Eye,
  Clock,
  CheckCircle2,
  Calendar,
  ChevronRight,
  Loader2,
  Settings,
  LayoutGrid,
  User,
  ShieldAlert,
  Save,
  ChevronLeft,
  Wallet,
  Copy,
  CreditCard,
  Link as LinkIcon
} from 'lucide-react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useLanguage } from '@/lib/LanguageContext'
import { toast } from 'react-toastify'

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const { lang, t } = useLanguage()
  const router = useRouter()
  const [invitations, setInvitations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [updatingProfile, setUpdatingProfile] = useState(false)
  const [newName, setNewName] = useState(user?.displayName || '')
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState('projects')
  const itemsPerPage = 5
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab) {
        setActiveTab(tab);
      }
    }
  }, [])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchInvitations = async () => {
      if (!user) return
      try {
        const q = query(
          collection(db, 'invitations'),
          where('userId', '==', user.uid)
        )
        const querySnapshot = await getDocs(q)
        const docs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        
        // Sort client-side to bypass composite index requirements in Firestore
        docs.sort((a: any, b: any) => {
          const dateA = a.createdAt || 0
          const dateB = b.createdAt || 0
          return dateB - dateA
        })

        setInvitations(docs)
      } catch (err) {
        console.error("Error fetching invitations:", err)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchInvitations()
      // Fetch user data for balance and referrals
      const fetchUserData = async () => {
        try {
          const res = await fetch(`/api/user?uid=${user.uid}`);
          if (res.ok) {
            const data = await res.json();
            setUserData(data);
          } else {
            // Agar hali user hujjati ochilmagan bo'lsa (yangi user), api o'zi yaratishi mumkin
          }
        } catch (e) {
          console.error("Failed to fetch user data", e);
        }
      }
      fetchUserData();
    }
  }, [user])

  const getInvitationTitle = (inv: any) => {
    const category = inv.category || 'wedding';
    const names = inv.names || 'Taklifnoma';
    
    if (category === 'birthday') {
      return lang === 'uz' 
        ? `Tug'ilgan kun: ${names}` 
        : lang === 'ru' 
          ? `День рождения: ${names}` 
          : `Birthday: ${names}`;
    }
    if (category === 'business') {
      const title = inv.eventTitle || inv.companyName || names;
      return lang === 'uz' 
        ? `Biznes tadbir: ${title}` 
        : lang === 'ru' 
          ? `Бизнес событие: ${title}` 
          : `Business Event: ${title}`;
    }
    if (category === 'farewell') {
      return lang === 'uz' 
        ? `Qiz uzatish: ${names}` 
        : lang === 'ru' 
          ? `Проводы невесты: ${names}` 
          : `Farewell Party: ${names}`;
    }
    return lang === 'uz' 
      ? `To'y taklifi: ${names}` 
      : lang === 'ru' 
        ? `Свадебное приглашение: ${names}` 
        : `Wedding Invitation: ${names}`;
  };

  const getInvitationThumbnail = (inv: any) => {
    const category = inv.category || 'wedding';
    const firstImg = inv.images?.[0];
    
    const isDefaultWeddingImg = firstImg === "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800" ||
                                firstImg === "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=200" ||
                                !firstImg;

    if (isDefaultWeddingImg) {
      if (category === 'birthday') {
        return "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=200";
      }
      if (category === 'business') {
        return "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=200";
      }
      if (category === 'farewell') {
        return "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=200";
      }
      return "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=200";
    }
    
    return firstImg;
  };

  const stats = useMemo(() => ({
    totalViews: invitations.reduce((acc, inv) => acc + (inv.views || 0), 0),
    pending: invitations.filter(i => i.status === 'pending').length,
    active: invitations.filter(i => i.status === 'active').length
  }), [invitations])

  const currentInvitations = useMemo(() => 
    invitations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  , [invitations, currentPage, itemsPerPage])

  const totalPages = useMemo(() => 
    Math.ceil(invitations.length / itemsPerPage)
  , [invitations.length, itemsPerPage])

  const handleUpdateProfile = async () => {
    if (!auth.currentUser) return
    setUpdatingProfile(true)
    try {
      await updateProfile(auth.currentUser, {
        displayName: newName
      })
      toast.success(lang === 'uz' ? "Profil yangilandi" : lang === 'ru' ? "Профиль обновлен" : "Profile updated")
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setUpdatingProfile(false)
    }
  }

  const handleResetPassword = async () => {
    if (!user?.email) return
    try {
      await sendPasswordResetEmail(auth, user.email)
      toast.info(lang === 'uz' ? "Email yuborildi. Spamni ham tekshiring." : "Email отправлен. Проверьте папку Спам.")
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const handleWithdraw = async () => {
    if (!cardNumber || cardNumber.length < 16) {
      toast.error(lang === 'uz' ? "Karta raqamini to'liq kiriting" : "Введите полный номер карты")
      return
    }
    if ((userData?.balance || 0) < 10000) {
      toast.error(lang === 'uz' ? "Minimal yechish summasi: 10,000 UZS" : "Минимальная сумма: 10,000 UZS")
      return
    }
    
    setIsWithdrawing(true)
    try {
      const res = await fetch('/api/bot/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user?.uid,
          email: user?.email,
          cardNumber,
          amount: userData?.balance || 0
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(lang === 'uz' ? "So'rov yuborildi! Tez orada pul tushib keladi." : "Запрос отправлен!");
        setUserData({ ...userData, balance: 0 });
        setCardNumber('');
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error("Xatolik yuz berdi");
    } finally {
      setIsWithdrawing(false)
    }
  }

  const copyReferralLink = () => {
    if (!user) return;
    const link = `https://taklif-go.vercel.app/?ref=${user.uid}`;
    navigator.clipboard.writeText(link);
    toast.success(lang === 'uz' ? "Havola nusxalandi!" : "Ссылка скопирована!");
  }

  if (authLoading || loading || !mounted) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#98a08d] animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-12 space-y-8 md:space-y-12">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
          <div className="space-y-1 md:space-y-2">
            <p className="text-[#98a08d] font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs">
              {lang === 'uz' ? 'Xush kelibsiz' : lang === 'ru' ? 'Добро пожаловать' : 'Welcome'}
            </p>
            <h1 className="text-3xl md:text-5xl font-serif text-[#5c6352]">
              {user?.displayName || t.myInvitations}
            </h1>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 md:space-y-8">
          <TabsList className="bg-white/50 border border-[#98a08d]/10 p-1 rounded-xl md:rounded-2xl w-full sm:w-auto overflow-x-auto flex-nowrap whitespace-nowrap">
            <TabsTrigger value="projects" className="flex-1 sm:flex-none rounded-lg md:rounded-xl px-4 md:px-6 py-2 md:py-2.5 data-[state=active]:bg-[#98a08d] data-[state=active]:text-white gap-2 font-bold transition-all text-sm">
              <LayoutGrid className="w-4 h-4" />
              {t.projects}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1 sm:flex-none rounded-lg md:rounded-xl px-4 md:px-6 py-2 md:py-2.5 data-[state=active]:bg-[#98a08d] data-[state=active]:text-white gap-2 font-bold transition-all text-sm">
              <Settings className="w-4 h-4" />
              {t.settings}
            </TabsTrigger>
            <TabsTrigger value="referrals" className="flex-1 sm:flex-none rounded-lg md:rounded-xl px-4 md:px-6 py-2 md:py-2.5 data-[state=active]:bg-[#98a08d] data-[state=active]:text-white gap-2 font-bold transition-all text-sm">
              <Wallet className="w-4 h-4" />
              Referal va Hamyon
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-8 md:space-y-12">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              <Card className="p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border-0 shadow-sm bg-white space-y-3 md:space-y-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#98a08d]/10 rounded-xl md:rounded-2xl flex items-center justify-center text-[#98a08d]">
                  <Eye className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-[#5c6352]">
                    {stats.totalViews}
                  </p>
                  <p className="text-[10px] text-[#98a08d] uppercase tracking-widest font-bold">
                    {t.totalViews}
                  </p>
                </div>
              </Card>

              <Card className="p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border-0 shadow-sm bg-white space-y-3 md:space-y-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-500/10 rounded-xl md:rounded-2xl flex items-center justify-center text-amber-600">
                  <Clock className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-[#5c6352]">
                    {stats.pending}
                  </p>
                  <p className="text-[10px] text-[#98a08d] uppercase tracking-widest font-bold">
                    {t.pending}
                  </p>
                </div>
              </Card>

              <Card className="p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border-0 shadow-sm bg-white space-y-3 md:space-y-4 sm:col-span-2 md:col-span-1">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#98a08d]/10 rounded-xl md:rounded-2xl flex items-center justify-center text-[#98a08d]">
                  <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-[#5c6352]">
                    {stats.active}
                  </p>
                  <p className="text-[10px] text-[#98a08d] uppercase tracking-widest font-bold">
                    {t.active}
                  </p>
                </div>
              </Card>
            </div>

            <div className="flex items-center justify-between px-1">
              <h3 className="text-[10px] md:text-sm font-bold text-[#98a08d] tracking-[0.2em] uppercase">
                {t.projectList}
              </h3>
              {invitations.length > 0 && (
                <span className="text-[10px] md:text-xs text-[#98a08d] font-bold bg-[#98a08d]/5 px-3 py-1 rounded-full border border-[#98a08d]/10">
                  {invitations.length} {t.projects}
                </span>
              )}
            </div>

            {invitations.length === 0 ? (
              <Card className="p-12 md:p-20 rounded-[2.5rem] md:rounded-[3rem] border-2 border-dashed border-[#98a08d]/20 bg-transparent flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-[#98a08d]/10 rounded-full flex items-center justify-center">
                  <Plus className="w-8 h-8 md:w-10 md:h-10 text-[#98a08d]" />
                </div>
                <div className="space-y-1 md:space-y-2">
                  <h4 className="text-lg md:text-xl font-serif text-[#5c6352]">
                    {t.nothingYet}
                  </h4>
                  <p className="text-[#98a08d] text-xs md:text-sm max-w-xs">
                    {t.createFirstDesc}
                  </p>
                </div>
              </Card>
            ) : (
              <div className="space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 gap-4 md:gap-6">
                  {currentInvitations.map((inv) => (
                    <Card
                      key={inv.id}
                      className="group relative overflow-hidden p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] border border-[#98a08d]/10 shadow-sm bg-white hover:shadow-2xl hover:shadow-[#98a08d]/15 transition-all duration-500 cursor-pointer"
                      onClick={() => router.push(`/success/${inv.id}`)}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-8">
                        {/* Image Container */}
                        <div className="relative w-full sm:w-24 md:w-32 aspect-[4/5] sm:aspect-square rounded-2xl overflow-hidden bg-[#faf9f6] border border-[#98a08d]/10 flex-shrink-0">
                          <img
                            src={getInvitationThumbnail(inv)}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                            alt=""
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 space-y-3 md:space-y-4 w-full">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className={`px-3 py-1 rounded-full font-bold text-[8px] md:text-[10px] uppercase tracking-[0.1em] border ${inv.status === 'active'
                                ? 'bg-[#98a08d]/10 text-[#98a08d] border-[#98a08d]/20'
                                : 'bg-amber-50 text-amber-600 border-amber-200'
                                }`}>
                                {inv.status === 'active' ? t.active : t.pending}
                              </span>
                              <div className="sm:hidden w-8 h-8 rounded-full bg-[#faf9f6] flex items-center justify-center text-[#98a08d]">
                                <ChevronRight className="w-4 h-4" />
                              </div>
                            </div>
                            <h4 className="text-xl md:text-2xl font-serif text-[#5c6352] group-hover:text-[#98a08d] transition-colors truncate">
                              {getInvitationTitle(inv)}
                            </h4>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs md:text-sm text-[#98a08d]">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-[#98a08d]/5 flex items-center justify-center">
                                <Calendar className="w-3.5 h-3.5" />
                              </div>
                              <span className="font-medium">{inv.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-[#98a08d]/5 flex items-center justify-center">
                                <Eye className="w-3.5 h-3.5" />
                              </div>
                              <span className="font-medium">{inv.views || 0} {t.totalViews.toLowerCase()}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="hidden sm:flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-[#faf9f6] text-[#98a08d] group-hover:bg-[#98a08d] group-hover:text-white transition-all duration-500 shadow-inner group-hover:rotate-12">
                          <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {invitations.length > itemsPerPage && (
                  <div className="flex justify-center pt-4">
                    <Pagination>
                      <PaginationContent className="bg-white p-2 rounded-2xl shadow-sm border border-[#98a08d]/10">
                        <PaginationItem>
                          <PaginationPrevious
                            className={`cursor-pointer hover:bg-[#98a08d]/10 rounded-xl transition-all ${currentPage === 1 ? 'opacity-30 pointer-events-none' : ''}`}
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          >
                            {t.previous}
                          </PaginationPrevious>
                        </PaginationItem>

                        {[...Array(totalPages)].map((_, i) => (
                          <PaginationItem key={i} className="hidden sm:block">
                            <PaginationLink
                              isActive={currentPage === i + 1}
                              onClick={() => setCurrentPage(i + 1)}
                              className={`cursor-pointer rounded-xl transition-all ${currentPage === i + 1
                                ? 'bg-[#98a08d] text-white hover:bg-[#98a08d]'
                                : 'hover:bg-[#98a08d]/10 hover:text-[#98a08d] text-[#98a08d]'
                                }`}
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        <PaginationItem>
                          <PaginationNext
                            className={`cursor-pointer hover:bg-[#98a08d]/10 rounded-xl transition-all ${currentPage === totalPages ? 'opacity-30 pointer-events-none' : ''
                              }`}
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          >
                            {t.next}
                          </PaginationNext>
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-8 rounded-[2.5rem] border-0 shadow-sm bg-white space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#98a08d]/10 rounded-2xl flex items-center justify-center text-[#98a08d]">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-serif text-[#5c6352]">{t.profileInfo}</h3>
                      <p className="text-xs text-[#98a08d] font-bold uppercase tracking-widest">{t.displayName}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-[#98a08d] uppercase font-bold tracking-wider">{t.displayName}</Label>
                      <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Ismingizni kiriting"
                        className="rounded-xl border-[#98a08d]/20 h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-[#98a08d] uppercase font-bold tracking-wider">Email</Label>
                      <Input
                        value={user?.email || ''}
                        disabled
                        className="rounded-xl border-[#98a08d]/20 h-12 bg-gray-50 opacity-60"
                      />
                    </div>
                    <Button
                      onClick={handleUpdateProfile}
                      disabled={updatingProfile}
                      className="bg-[#98a08d] hover:bg-[#868d7c] text-white rounded-xl px-8 h-12 gap-2 font-bold transition-all"
                    >
                      {updatingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {t.saveChanges}
                    </Button>
                  </div>
                </Card>

                <Card className="p-8 rounded-[2.5rem] border-0 shadow-sm bg-white space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600">
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-serif text-[#5c6352]">{t.accountSecurity}</h3>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      variant="outline"
                      onClick={handleResetPassword}
                      className="flex-1 rounded-xl h-12 border-[#98a08d]/20 text-[#98a08d] hover:bg-[#98a08d] hover:text-white transition-all font-bold"
                    >
                      {t.changePassword}
                    </Button>
                  </div>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="p-8 rounded-[2.5rem] border-0 shadow-sm bg-red-50/50 border-red-100 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-serif text-red-600 flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5" />
                      {t.dangerZone}
                    </h3>
                    <p className="text-xs text-red-400 font-medium">
                      {lang === 'uz' ? 'Hisobni o\'chirish qaytarib bo\'lmas jarayondir.' : 'Удаление аккаунта - это необратимый процесс.'}
                    </p>
                  </div>
                  <Button variant="destructive" className="w-full rounded-xl h-12 font-bold shadow-lg shadow-red-200/50">
                    {t.deleteAccount}
                  </Button>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="referrals" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-8 rounded-[2.5rem] border-0 shadow-sm bg-white space-y-8">
                  <div className="flex flex-col space-y-2">
                    <h3 className="text-2xl font-serif text-[#5c6352]">Sizning Referal Havolangiz</h3>
                    <p className="text-sm text-[#98a08d]">Ushbu havolani do'stlaringizga yuboring va har bir buyurtmadan 5,000 UZS bonus oling!</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Input
                        value={`https://taklif-go.vercel.app/?ref=${user?.uid || ''}`}
                        readOnly
                        className="rounded-xl border-[#98a08d]/20 h-14 pl-12 font-medium text-[#5c6352] bg-gray-50/50"
                      />
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#98a08d]" />
                    </div>
                    <Button
                      onClick={copyReferralLink}
                      className="bg-[#98a08d] hover:bg-[#868d7c] text-white rounded-xl h-14 px-8 font-bold gap-2 shrink-0"
                    >
                      <Copy className="w-5 h-5" />
                      Nusxa olish
                    </Button>
                  </div>
                </Card>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Card className="p-8 rounded-[2.5rem] border-0 shadow-sm bg-white">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                      <User className="w-6 h-6" />
                    </div>
                    <h4 className="text-[10px] text-[#98a08d] uppercase tracking-widest font-bold mb-1">Taklif Qilinganlar</h4>
                    <p className="text-4xl font-bold text-[#5c6352]">{userData?.totalReferrals || 0}</p>
                  </Card>
                  
                  <Card className="p-8 rounded-[2.5rem] border-0 shadow-sm bg-[#98a08d]/5 border-[#98a08d]/10 relative overflow-hidden">
                    <div className="w-12 h-12 bg-[#98a08d]/10 rounded-2xl flex items-center justify-center text-[#98a08d] mb-6">
                      <Wallet className="w-6 h-6" />
                    </div>
                    <h4 className="text-[10px] text-[#98a08d] uppercase tracking-widest font-bold mb-1">Joriy Balans</h4>
                    <p className="text-4xl font-bold text-[#98a08d]">{userData?.balance?.toLocaleString() || 0} <span className="text-xl">UZS</span></p>
                  </Card>
                </div>
              </div>

              <div className="space-y-6">
                <Card className="p-8 rounded-[2.5rem] border-0 shadow-sm bg-white">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-600">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-serif text-[#5c6352]">Pul Yechish</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-[#98a08d] uppercase font-bold tracking-wider">Karta raqami</Label>
                      <Input
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                        placeholder="8600 1234 5678 9012"
                        className="rounded-xl border-[#98a08d]/20 h-12"
                      />
                    </div>
                    
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                      <p className="text-xs text-amber-700 font-medium">
                        Minimal yechish summasi: <b>10,000 UZS</b>
                      </p>
                    </div>

                    <Button
                      onClick={handleWithdraw}
                      disabled={isWithdrawing || (userData?.balance || 0) < 10000}
                      className="w-full bg-[#5c6352] hover:bg-[#4a5042] text-white rounded-xl h-12 font-bold"
                    >
                      {isWithdrawing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Yechib olish so'rovi"}
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
