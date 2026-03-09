import { AnimatePresence, motion } from 'framer-motion'
import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Menu,
  PhoneCall,
  Settings,
  Users,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

interface AppShellProps {
  children: React.ReactNode
}

const navItems = [
  { to: '/', label: 'Prospection', icon: BriefcaseBusiness },
  { to: '/appels', label: 'Appels', icon: PhoneCall },
  { to: '/vue-ensemble', label: "Vue d'ensemble", icon: LayoutDashboard },
  { to: '/planning', label: 'Planning', icon: CalendarDays },
  { to: '/progresser', label: 'Progresser', icon: GraduationCap },
  { to: '/factures', label: 'Factures', icon: FileText },
  { to: '/contact-garages', label: 'Contact Garages', icon: Building2 },
  { to: '/equipe', label: 'Équipe', icon: Users, adminOnly: true },
  { to: '/parametres', label: 'Paramètres', icon: Settings },
]

const mobileTabs = ['/', '/appels', '/vue-ensemble', '/planning', '/progresser']

export const AppShell = ({ children }: AppShellProps) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { currentUser, logout } = useApp()

  const currentTitle = useMemo(
    () => navItems.find((item) => item.to === location.pathname)?.label ?? 'TransakPro',
    [location.pathname],
  )

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      <div className="flex">
        <aside className="hidden w-72 shrink-0 border-r border-zinc-800 bg-[#141414] p-5 md:block">
          <SidebarContent onNavigate={() => undefined} />
        </aside>

        <AnimatePresence>
          {mobileOpen ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
              onClick={() => setMobileOpen(false)}
            >
              <motion.aside
                initial={{ x: -260 }}
                animate={{ x: 0 }}
                exit={{ x: -260 }}
                transition={{ type: 'spring', damping: 24, stiffness: 250 }}
                className="h-full w-72 border-r border-zinc-800 bg-[#141414] p-5"
                onClick={(event) => event.stopPropagation()}
              >
                <SidebarContent onNavigate={() => setMobileOpen(false)} />
              </motion.aside>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <main className="w-full pb-24 md:pb-8">
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-zinc-800 bg-[#0F0F0F]/95 px-4 py-3 backdrop-blur md:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen((prev) => !prev)}
                className="grid h-11 w-11 place-items-center rounded-xl border border-zinc-700 bg-[#1A1A1A] md:hidden"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
              <div className="hidden sm:block">
                <p className="text-xs text-zinc-400">TransakPro CRM</p>
                <h1 className="text-lg font-semibold">{currentTitle}</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="h-10 w-10 rounded-full border border-zinc-700 object-cover"
              />
              <button
                type="button"
                onClick={logout}
                className="hidden rounded-xl border border-zinc-700 px-3 py-2 text-sm text-zinc-300 md:block"
              >
                Déconnexion
              </button>
            </div>
          </header>

          <div className="p-4 md:p-6">{children}</div>
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-800 bg-[#141414] p-2 md:hidden">
        <div className="mx-auto grid max-w-xl grid-cols-5 gap-2">
          {navItems
            .filter((item) => mobileTabs.includes(item.to))
            .map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex min-h-11 flex-col items-center justify-center rounded-xl px-2 py-1 text-[11px] ${
                      isActive ? 'bg-[#FF6B35] text-white' : 'text-zinc-400'
                    }`
                  }
                >
                  <Icon size={16} />
                  <span className="mt-1">{item.label === "Vue d'ensemble" ? 'Vue' : item.label.split(' ')[0]}</span>
                </NavLink>
              )
            })}
        </div>
      </nav>
    </div>
  )
}

const SidebarContent = ({ onNavigate }: { onNavigate: () => void }) => {
  const { currentUser } = useApp()

  return (
    <div className="flex h-full flex-col">
      <Link to="/" onClick={onNavigate} className="mb-6 text-xl font-semibold text-white">
        Transak<span className="text-[#FF6B35]">Pro</span>
      </Link>
      <div className="space-y-2">
        {navItems
          .filter((item) => !item.adminOnly || currentUser?.role === 'admin')
          .map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `flex min-h-11 items-center gap-3 rounded-xl px-3 ${
                    isActive
                      ? 'bg-[#FF6B35]/15 text-[#FF6B35]'
                      : 'text-zinc-300 hover:bg-[#1A1A1A]'
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
      </div>
      <div className="mt-auto rounded-2xl border border-zinc-800 bg-[#1A1A1A] p-3 text-xs text-zinc-400">
        <p>Mode mobile-first activé</p>
        <p className="mt-1 text-zinc-500">Objectif: 44px min par zone tactile</p>
      </div>
    </div>
  )
}
