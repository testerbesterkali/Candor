import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { supabase } from '../../lib/supabase'
import { LayoutDashboard, Users, Database, Activity, Settings as SettingsIcon, LogOut } from 'lucide-react'

export default function AppLayout() {
    const { company, setUser, setProfile, setCompany } = useAuthStore()
    const location = useLocation()
    const navigate = useNavigate()

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Pipeline', path: '/pipeline', icon: Users },
        { name: 'Talent Bank', path: '/talent-bank', icon: Database },
        { name: 'Candor Score', path: '/score', icon: Activity },
        { name: 'Settings', path: '/settings', icon: SettingsIcon },
    ]

    const handleLogout = async () => {
        await supabase.auth.signOut()
        setUser(null)
        setProfile(null)
        setCompany(null)
        navigate('/')
    }

    return (
        <div className="h-screen w-full bg-background flex overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-200 bg-white flex flex-col fixed inset-y-0 left-0 z-50">
                <div className="p-6">
                    <Link to="/dashboard" className="text-2xl font-bold tracking-tight text-primary">
                        Candor
                    </Link>
                    {company && (
                        <div className="mt-6 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {company.name.charAt(0)}
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-semibold text-sm truncate">{company.name}</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <div className={`w-2 h-2 rounded-full ${(company.candor_score ?? 0) >= 70 ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                    <p className="text-xs text-muted-foreground font-medium">Score: {company.candor_score}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = location.pathname.startsWith(item.path)
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-slate-200">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Log out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 h-full overflow-y-auto min-w-0 flex flex-col relative">
                <Outlet />
            </main>
        </div>
    )
}
