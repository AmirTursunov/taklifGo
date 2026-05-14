'use client'

import { useEffect, useState } from 'react'
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
  Save
} from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'
import { toast } from 'react-toastify'

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const { lang, t } = useLanguage()
  const router = useRouter()
  const [invitations, setInvitations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingProfile, setUpdatingProfile] = useState(false)
  const [newName, setNewName] = useState(user?.displayName || '')

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
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        )
        const querySnapshot = await getDocs(q)
        const docs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setInvitations(docs)
      } catch (err) {
        console.error("Error fetching invitations:", err)
      } finally {
        setLoading(false)
      }
    }

    if (user) fetchInvitations()
  }, [user])

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

  if (authLoading || loading) {
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

        <Tabs defaultValue="projects" className="space-y-6 md:space-y-8">
          <TabsList className="bg-white/50 border border-[#98a08d]/10 p-1 rounded-xl md:rounded-2xl w-full sm:w-auto overflow-x-auto flex-nowrap whitespace-nowrap">
            <TabsTrigger value="projects" className="flex-1 sm:flex-none rounded-lg md:rounded-xl px-4 md:px-6 py-2 md:py-2.5 data-[state=active]:bg-[#98a08d] data-[state=active]:text-white gap-2 font-bold transition-all text-sm">
              <LayoutGrid className="w-4 h-4" />
              {t.projects}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1 sm:flex-none rounded-lg md:rounded-xl px-4 md:px-6 py-2 md:py-2.5 data-[state=active]:bg-[#98a08d] data-[state=active]:text-white gap-2 font-bold transition-all text-sm">
              <Settings className="w-4 h-4" />
              {t.settings}
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
                    {invitations.reduce((acc, inv) => acc + (inv.views || 0), 0)}
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
                    {invitations.filter(i => i.status === 'pending').length}
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
                    {invitations.filter(i => i.status === 'active').length}
                  </p>
                  <p className="text-[10px] text-[#98a08d] uppercase tracking-widest font-bold">
                    {t.active}
                  </p>
                </div>
              </Card>
            </div>

            {/* Invitations List */}
            <div className="space-y-4 md:space-y-6">
              <h3 className="text-[10px] md:text-sm font-bold text-[#98a08d] tracking-[0.2em] uppercase px-1">
                {t.projectList}
              </h3>

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
                <div className="grid grid-cols-1 gap-4">
                  {invitations.map((inv) => (
                    <Card
                      key={inv.id}
                      className="group p-3 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-[#98a08d]/5 shadow-sm bg-white hover:shadow-xl hover:shadow-[#98a08d]/10 transition-all flex items-center justify-between gap-3 md:gap-6 cursor-pointer overflow-hidden"
                      onClick={() => router.push(`/success/${inv.id}`)}
                    >
                      <div className="flex items-center gap-3 md:gap-6 min-w-0">
                        <div className="w-14 h-18 md:w-20 md:h-24 rounded-xl overflow-hidden bg-[#faf9f6] border border-[#98a08d]/10 flex-shrink-0">
                          <img
                            src={inv.images?.[0] || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=200'}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            alt=""
                          />
                        </div>
                        <div className="space-y-1 min-w-0">
                          <h4 className="text-base md:text-xl font-serif text-[#5c6352] truncate">{inv.names}</h4>
                          <div className="flex items-center gap-2 md:gap-4 text-[10px] md:text-xs text-[#98a08d]">
                            <span className="flex items-center gap-1 shrink-0">
                              <Calendar className="w-3 h-3" />
                              <span className="hidden xs:inline">{inv.date}</span>
                            </span>
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[8px] md:text-[9px] uppercase tracking-wider ${inv.status === 'active' ? 'bg-[#98a08d]/10 text-[#98a08d]' : 'bg-amber-100 text-amber-600'
                              }`}>
                              {inv.status === 'active' ? t.active : t.pending}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-[#faf9f6] flex items-center justify-center text-[#98a08d] group-hover:bg-[#98a08d] group-hover:text-white transition-all">
                          <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
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
        </Tabs>
      </main>
    </div>
  )
}
