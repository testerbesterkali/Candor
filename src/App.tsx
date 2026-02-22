import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { useAuthStore } from './store/authStore'

// Pages
import Auth from './pages/Auth'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Landing from './pages/Landing'
import Pipeline from './pages/Pipeline'
import TalentBank from './pages/TalentBank'
import Score from './pages/Score'
import Settings from './pages/Settings'
import Review from './pages/Review'

// Layouts
import AppLayout from './components/layout/AppLayout'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, company, isLoading } = useAuthStore()

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  if (!user) return <Navigate to="/auth" />

  // If user is authenticated but company hasn't connected ATS, force onboarding
  if (company && !company.ats_connected && window.location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" />
  }

  return <>{children}</>
}

function App() {
  const { setUser, setProfile, setCompany, setLoading } = useAuthStore()

  useEffect(() => {
    // Check active session and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfileAndCompany(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfileAndCompany(session.user.id)
      } else {
        setProfile(null)
        setCompany(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfileAndCompany = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      setProfile(profile)

      if (profile?.company_id) {
        const { data: company } = await supabase
          .from('companies')
          .select('*')
          .eq('id', profile.company_id)
          .single()
        setCompany(company)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />

        {/* Protected Routes directly without common layout */}
        <Route path="/onboarding" element={
          <PrivateRoute>
            <Onboarding />
          </PrivateRoute>
        } />

        {/* Protected Routes with Dashboard Layout */}
        <Route element={<PrivateRoute><AppLayout /></PrivateRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/talent-bank" element={<TalentBank />} />
          <Route path="/score" element={<Score />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/review/:id" element={<Review />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
