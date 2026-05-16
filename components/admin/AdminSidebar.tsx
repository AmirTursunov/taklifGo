'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  Settings, 
  LogOut, 
  CreditCard,
  Sparkles
} from 'lucide-react'
import { motion } from 'framer-motion'

const MENU_ITEMS = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { name: 'Invitations', icon: ClipboardList, path: '/admin/invitations' },
  { name: 'Templates', icon: Sparkles, path: '/admin/templates' },
  { name: 'Users', icon: Users, path: '/admin/users' },
  { name: 'Revenue', icon: CreditCard, path: '/admin/revenue' },
  { name: 'Settings', icon: Settings, path: '/admin/settings' },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-72 h-screen sticky top-0 bg-[#1a1a1a] text-white flex flex-col border-r border-white/5">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#98a08d] rounded-xl flex items-center justify-center shadow-lg shadow-[#98a08d]/20">
          <Sparkles className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tighter">NAFOSAT</h1>
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Admin Control</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 py-6">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.path
          return (
            <Link key={item.path} href={item.path}>
              <motion.div
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all relative group ${
                  isActive 
                    ? 'bg-white/10 text-white shadow-xl border border-white/5' 
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-[#98a08d]' : ''}`} />
                <span className="font-bold text-sm tracking-wide">{item.name}</span>
                
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute left-0 w-1 h-6 bg-[#98a08d] rounded-full"
                  />
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      <div className="p-6 mt-auto">
        <button 
          onClick={() => window.location.href = '/'}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-white/40 hover:text-red-400 hover:bg-red-400/5 transition-all font-bold text-sm"
        >
          <LogOut className="w-5 h-5" />
          Go to Site
        </button>
      </div>
    </aside>
  )
}
