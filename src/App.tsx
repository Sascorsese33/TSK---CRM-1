import { AnimatePresence, motion } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { useApp } from './context/AppContext'
import { CallsPage } from './pages/CallsPage'
import { ContactGaragesPage } from './pages/ContactGaragesPage'
import { DashboardPage } from './pages/DashboardPage'
import { FacturesPage } from './pages/FacturesPage'
import { LoginPage } from './pages/LoginPage'
import { PlanningPage } from './pages/PlanningPage'
import { ProgresserPage } from './pages/ProgresserPage'
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
            <Route path="/" element={<ProspectionPage />} />
            <Route path="/prospection" element={<Navigate to="/" replace />} />
            <Route path="/appels" element={<CallsPage />} />
            <Route path="/vue-ensemble" element={<DashboardPage />} />
            <Route path="/planning" element={<PlanningPage />} />
            <Route path="/progresser" element={<ProgresserPage />} />
            <Route path="/performances" element={<Navigate to="/progresser" replace />} />
            <Route path="/factures" element={<FacturesPage />} />
            <Route path="/contact-garages" element={<ContactGaragesPage />} />
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
