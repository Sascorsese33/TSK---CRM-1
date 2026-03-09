import { AnimatePresence, motion } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { useApp } from './context/AppContext'
import { CallsPage } from './pages/CallsPage'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { PerformancesPage } from './pages/PerformancesPage'
import { PlanningPage } from './pages/PlanningPage'
import { ProspectionPage } from './pages/ProspectionPage'
import { SettingsPage } from './pages/SettingsPage'
import { TeamPage } from './pages/TeamPage'

const App = () => {
  const { currentUser } = useApp()
  const location = useLocation()

  if (!currentUser) {
    return <LoginPage />
  }

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <Routes location={location}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/prospection" element={<ProspectionPage />} />
            <Route path="/appels" element={<CallsPage />} />
            <Route path="/planning" element={<PlanningPage />} />
            <Route path="/performances" element={<PerformancesPage />} />
            <Route path="/equipe" element={<TeamPage />} />
            <Route path="/parametres" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </AppShell>
  )
}

export default App
