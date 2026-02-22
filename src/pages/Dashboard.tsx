import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { formatTimeAgo, cn } from '../lib/utils'
import { Card } from '../components/ui/Card'
import { Send, Clock, Users, Activity, ArrowRight, Sparkles, CheckCircle2, ChevronRight, Mail, AlertTriangle } from 'lucide-react'

export default function Dashboard() {
    const { company } = useAuthStore()

    // 1. Stats Query
    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['dashboardStats', company?.id],
        queryFn: async () => {
            const now = new Date()
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

            const { count: emailsSent } = await supabase
                .from('communications')
                .select('*', { count: 'exact', head: true })
                .eq('company_id', company!.id)
                .eq('status', 'sent')
                .gte('sent_at', startOfMonth)

            const { count: talentBank } = await supabase
                .from('candidates')
                .select('*', { count: 'exact', head: true })
                .eq('company_id', company!.id)
                .eq('added_to_talent_bank', true)

            return {
                emailsSent: emailsSent || 0,
                talentBank: talentBank || 0,
                avgResponseTime: '24 hrs', // Mocked calculation for MVP until edge function populates it accurately
                candorScore: company!.candor_score || 0
            }
        },
        enabled: !!company
    })

    // 2. Needs Attention Query
    const { data: needsAttention, isLoading: attentionLoading } = useQuery({
        queryKey: ['needsAttention', company?.id],
        queryFn: async () => {
            const { count: drafts } = await supabase
                .from('communications')
                .select('*', { count: 'exact', head: true })
                .eq('company_id', company!.id)
                .eq('status', 'draft')

            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            const { count: overdue } = await supabase
                .from('candidates')
                .select('*', { count: 'exact', head: true })
                .eq('company_id', company!.id)
                .gte('days_in_stage', 7) // Or test via last_status_change
                .not('status', 'in', '("rejected","archived")')

            const { count: unactionedMatches } = await supabase
                .from('talent_bank_matches')
                .select('*', { count: 'exact', head: true })
                .eq('company_id', company!.id)
                .eq('actioned', false)

            return {
                drafts: drafts || 0,
                overdue: overdue || 0,
                unactionedMatches: unactionedMatches || 0
            }
        },
        enabled: !!company
    })

    // 3. Recent Activity Query
    const { data: activity, isLoading: activityLoading } = useQuery({
        queryKey: ['recentActivity', company?.id],
        queryFn: async () => {
            const { data } = await supabase
                .from('communications')
                .select('*, candidates(name, roles(title))')
                .eq('company_id', company!.id)
                .order('created_at', { ascending: false })
                .limit(8)
            return data || []
        },
        enabled: !!company
    })

    // Welcome message based on time of day
    const hour = new Date().getHours()
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-8 pb-20">

            {/* Sleek Header */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                        {greeting}, <span className="text-primary">Recruiter</span>
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Here's what's happening across your active hiring pipeline today.
                    </p>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Emails Sent"
                    subtitle="This month"
                    value={stats?.emailsSent}
                    icon={Send}
                    loading={statsLoading}
                    trend="+12%"
                    trendUp={true}
                />
                <StatCard
                    title="Avg Response"
                    subtitle="To candidates"
                    value={stats?.avgResponseTime}
                    icon={Clock}
                    loading={statsLoading}
                    trend="Faster"
                    trendUp={true}
                />
                <StatCard
                    title="Talent Bank"
                    subtitle="Total candidates"
                    value={stats?.talentBank}
                    icon={Users}
                    loading={statsLoading}
                    trend="+4"
                    trendUp={true}
                />
                <StatCard
                    title="Candor Score"
                    subtitle="Out of 100"
                    value={stats?.candorScore}
                    icon={Activity}
                    loading={statsLoading}
                    valueColor={
                        (stats?.candorScore || 0) >= 70 ? 'text-emerald-600' :
                            (stats?.candorScore || 0) >= 40 ? 'text-amber-500' : 'text-rose-500'
                    }
                    iconBg={
                        (stats?.candorScore || 0) >= 70 ? 'bg-emerald-100 text-emerald-600' :
                            (stats?.candorScore || 0) >= 40 ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
                    }
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Needs Attention */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Needs Your Attention</h2>
                    </div>

                    <div className="grid gap-3">
                        <AttentionCard
                            count={needsAttention?.drafts}
                            loading={attentionLoading}
                            title="Emails pending review"
                            description="AI drafted emails that require human approval before sending."
                            linkTo="/pipeline"
                            icon={Mail}
                            color="blue"
                        />
                        <AttentionCard
                            count={needsAttention?.overdue}
                            loading={attentionLoading}
                            title="Overdue candidates"
                            description="Candidates residing in the same stage for more than 7 days."
                            linkTo="/pipeline"
                            icon={AlertTriangle}
                            color="amber"
                        />
                        <AttentionCard
                            count={needsAttention?.unactionedMatches}
                            loading={attentionLoading}
                            title="Unactioned talent matches"
                            description="Past silver-medal candidates perfectly matching your new roles."
                            linkTo="/talent-bank"
                            icon={Sparkles}
                            color="indigo"
                        />
                    </div>
                </div>

                {/* Right Column: Activity Feed */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Recent Activity</h2>
                        <Link to="/pipeline" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center">
                            View all <ChevronRight className="w-4 h-4 ml-0.5" />
                        </Link>
                    </div>

                    <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden flex flex-col h-[400px]">
                        <div className="flex-1 overflow-y-auto p-2">
                            {activityLoading ? (
                                <div className="p-4 space-y-4">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="flex gap-4 items-start">
                                            <div className="w-2 h-2 mt-2 rounded-full bg-slate-200 animate-pulse" />
                                            <div className="space-y-2 flex-1">
                                                <div className="h-4 w-3/4 bg-slate-100 rounded animate-pulse" />
                                                <div className="h-3 w-1/2 bg-slate-50 rounded animate-pulse" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : activity?.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3 border border-slate-100">
                                        <Clock className="w-6 h-6 text-slate-300" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-900">No recent activity</p>
                                    <p className="text-xs text-slate-500 mt-1">Actions will appear here automatically.</p>
                                </div>
                            ) : (
                                <div className="relative">
                                    {/* Timeline line */}
                                    <div className="absolute left-6 top-4 bottom-4 w-px bg-slate-100" />

                                    <div className="space-y-1 relative pt-2">
                                        {activity?.map((entry: any) => (
                                            <div key={entry.id} className="relative flex gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors group">
                                                <div className="mt-1 relative z-10 w-6 flex justify-center shrink-0">
                                                    <div className={cn(
                                                        "w-2.5 h-2.5 rounded-full ring-4 ring-white shadow-sm transition-transform group-hover:scale-125",
                                                        entry.status === 'sent' ? 'bg-emerald-500' : 'bg-slate-300'
                                                    )} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-baseline justify-between gap-2">
                                                        <p className="text-sm font-semibold text-slate-900 truncate">
                                                            {entry.candidates?.name || 'Unknown Candidate'}
                                                        </p>
                                                        <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">
                                                            {formatTimeAgo(entry.created_at)}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                                                        {entry.candidates?.roles?.title}
                                                    </p>
                                                    <div className="mt-1.5 flex items-center gap-1.5">
                                                        <span className={cn(
                                                            "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider",
                                                            entry.status === 'sent'
                                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                                                                : "bg-slate-100 text-slate-600 border border-slate-200"
                                                        )}>
                                                            {entry.status === 'sent' ? 'Sent' : 'Drafted'}
                                                        </span>
                                                        <span className="text-xs text-slate-500 capitalize">{entry.type}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

            </div>
        </div>
    )
}

function StatCard({ title, subtitle, value, icon: Icon, loading, valueColor = "text-slate-900", iconBg = "bg-primary/10 text-primary", trend, trendUp }: any) {
    return (
        <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-2xl overflow-hidden group">
            <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", iconBg)}>
                        <Icon className="w-5 h-5" />
                    </div>
                    {trend && (
                        <div className={cn(
                            "inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold",
                            trendUp ? "text-emerald-700 bg-emerald-50 border border-emerald-100" : "text-rose-700 bg-rose-50 border border-rose-100"
                        )}>
                            {trend}
                        </div>
                    )}
                </div>
                <div>
                    {loading ? (
                        <div className="h-8 w-20 bg-slate-100 rounded animate-pulse mb-1" />
                    ) : (
                        <div className={cn("text-3xl font-bold tracking-tight mb-1", valueColor)}>
                            {value !== undefined ? value : '—'}
                        </div>
                    )}
                    <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
                </div>
            </div>
        </Card>
    )
}

function AttentionCard({ count, loading, title, description, linkTo, icon: Icon, color }: any) {
    if (loading) {
        return <Card className="bg-white h-[90px] border border-slate-200 rounded-2xl animate-pulse" />
    }

    const isZero = count === 0;

    const colorConfig = {
        blue: {
            bg: "bg-blue-50 border-blue-200/60 hover:border-blue-300",
            iconBg: "bg-blue-100 text-blue-600 ring-4 ring-blue-50",
            text: "text-blue-900",
            iconDefaultBg: "bg-slate-50 text-slate-400 border border-slate-200",
        },
        amber: {
            bg: "bg-amber-50/50 border-amber-200/60 hover:border-amber-300",
            iconBg: "bg-amber-100 text-amber-600 ring-4 ring-amber-50",
            text: "text-amber-900",
            iconDefaultBg: "bg-slate-50 text-slate-400 border border-slate-200",
        },
        indigo: {
            bg: "bg-indigo-50/50 border-indigo-200/60 hover:border-indigo-300",
            iconBg: "bg-indigo-100 text-indigo-600 ring-4 ring-indigo-50",
            text: "text-indigo-900",
            iconDefaultBg: "bg-slate-50 text-slate-400 border border-slate-200",
        }
    }[color as 'blue' | 'amber' | 'indigo'];

    return (
        <Link to={linkTo} className={cn(
            "block transition-all duration-200",
            isZero ? "opacity-60 pointer-events-none" : "hover:-translate-y-1"
        )}>
            <Card className={cn(
                "rounded-2xl transition-colors shadow-sm",
                isZero ? "bg-white border border-slate-200" : colorConfig.bg
            )}>
                <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                        <div className="relative shrink-0">
                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform",
                                isZero ? colorConfig.iconDefaultBg : colorConfig.iconBg
                            )}>
                                {isZero ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                            </div>
                            {!isZero && (
                                <div className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                                    {count > 99 ? '99+' : count}
                                </div>
                            )}
                        </div>
                        <div className="min-w-0">
                            <h3 className={cn(
                                "font-bold text-[15px] sm:text-base leading-none mb-1.5 truncate",
                                isZero ? "text-slate-500" : colorConfig.text
                            )}>
                                {title}
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-500 line-clamp-1 sm:line-clamp-none leading-relaxed">
                                {isZero ? "All caught up" : description}
                            </p>
                        </div>
                    </div>
                    {!isZero && (
                        <div className="shrink-0 w-8 h-8 rounded-full bg-white/60 flex items-center justify-center">
                            <ArrowRight className={cn("w-4 h-4", colorConfig.text, "opacity-60")} />
                        </div>
                    )}
                </div>
            </Card>
        </Link>
    )
}
